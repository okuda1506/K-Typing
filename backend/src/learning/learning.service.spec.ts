import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import type { LessonProgress, UserLevelProgress } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LearningService } from './learning.service';
import {
    LEARNING_LEVEL_CODES,
    LESSONS_PER_LEVEL,
    QUESTIONS_PER_LESSON,
} from './constants/learning.constants';
import type { LearningMaster } from './types/learning-master.type';
import type { LearningProgress } from './types/learning-progress.type';
import type { LearningLevel } from './types/learning-level.type';

const savedAt = new Date('2026-11-01T00:00:00.000Z');
const interestId = 'interest-1';

function createMasters(): LearningMaster[] {
    return LEARNING_LEVEL_CODES.map((code, levelIndex) => ({
        id: code,
        code,
        title: code,
        orderNo: levelIndex + 1,
        requiredAccuracy: new Prisma.Decimal(80),
        lessons: Array.from({ length: LESSONS_PER_LEVEL }, (_, index) => ({
            id: `${code}-${index + 1}`,
            title: `Lesson ${index + 1}`,
            themeType: 'default',
            orderNo: index + 1,
            questionCount: QUESTIONS_PER_LESSON,
        })),
    }));
}

function createLessonProgress(
    scores: number[],
    selectedInterestId = interestId,
): LessonProgress[] {
    return scores.map((score, index) => ({
        userId: 'user-1',
        interestId: selectedInterestId,
        lessonId: `${LEARNING_LEVEL_CODES[0]}-${index + 1}`,
        generatedBatchId: null,
        startedAt: savedAt,
        completedAt: savedAt,
        bestAccuracy: new Prisma.Decimal(score),
        bestWpm: new Prisma.Decimal(0),
        completedCount: 1,
        createdAt: savedAt,
        updatedAt: savedAt,
    }));
}

function createLevelProgress(
    levelId: string,
    requiredAccuracySnapshot: number | null,
): UserLevelProgress {
    return {
        userId: 'user-1',
        interestId,
        levelId,
        unlockedAt: savedAt,
        startedAt: savedAt,
        completedAt: null,
        passedAt: null,
        detailAnswerSnapshot: 'detail',
        requiredAccuracySnapshot:
            requiredAccuracySnapshot === null
                ? null
                : new Prisma.Decimal(requiredAccuracySnapshot),
        createdAt: savedAt,
        updatedAt: savedAt,
    };
}

describe('LearningService lesson pass rules', () => {
    let service: LearningService;
    let masters: LearningMaster[];

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LearningService,
                { provide: PrismaService, useValue: {} },
            ],
        }).compile();
        service = module.get(LearningService);
        masters = createMasters();
    });

    function buildLevels(
        progress: LearningProgress,
        selectedInterestId = interestId,
    ): LearningLevel[] {
        return service['buildLearningLevels'](
            masters,
            selectedInterestId,
            progress,
        );
    }

    it('does not compensate a failed lesson with high scores in other lessons', () => {
        const levels = buildLevels({
            levelProgresses: [],
            lessonProgresses: createLessonProgress([100, 100, 100, 100, 60]),
        });

        expect(levels[0].completedLessonCount).toBe(5);
        expect(levels[0].passedLessonCount).toBe(4);
        expect(levels[0].lessons.map((lesson) => lesson.isPassed)).toEqual([
            true,
            true,
            true,
            true,
            false,
        ]);
        expect(levels[0]).not.toHaveProperty('overallAccuracy');
        expect(levels[0].passedAt).toBeNull();
        expect(levels[1].isUnlocked).toBe(false);
    });

    it('counts all five passing lessons without inventing saved unlock dates', () => {
        const levels = buildLevels({
            levelProgresses: [],
            lessonProgresses: createLessonProgress([80, 80, 80, 80, 80]),
        });

        expect(levels[0].passedLessonCount).toBe(5);
        expect(levels[0].lessons.every((lesson) => lesson.isPassed)).toBe(true);
        expect(levels[0].passedAt).toBeNull();
        expect(levels[1].unlockedAt).toBeNull();
    });

    it('compares each saved score at the 80 percent boundary without rounding', () => {
        const [level] = buildLevels({
            levelProgresses: [],
            lessonProgresses: createLessonProgress([
                79.999, 80, 80.001, 0, 100,
            ]),
        });

        expect(level.passedLessonCount).toBe(3);
        expect(level.lessons.map((lesson) => lesson.isPassed)).toEqual([
            false,
            true,
            true,
            false,
            true,
        ]);
        expect(level.lessons[3].bestAccuracy).toBe(0);
    });

    it.each([
        { completedAt: null, completedCount: 1 },
        { completedAt: savedAt, completedCount: 0 },
        { completedAt: null, completedCount: 0 },
    ])('does not pass an unfinished lesson: %o', (state) => {
        const lessonProgresses = createLessonProgress([
            100, 100, 100, 100, 100,
        ]);
        Object.assign(lessonProgresses[4], state);
        const [level] = buildLevels({ levelProgresses: [], lessonProgresses });

        expect(level.lessons[4].isPassed).toBe(false);
        expect(level.passedLessonCount).toBe(4);
    });

    it.each([
        { snapshot: 85, masterThreshold: 80, score: 84, expected: 0 },
        { snapshot: 80, masterThreshold: 90, score: 80, expected: 5 },
    ])('uses the saved threshold before the master: %o', (testCase) => {
        masters[0].requiredAccuracy = new Prisma.Decimal(
            testCase.masterThreshold,
        );
        const [level] = buildLevels({
            levelProgresses: [
                createLevelProgress(LEARNING_LEVEL_CODES[0], testCase.snapshot),
            ],
            lessonProgresses: createLessonProgress(
                Array<number>(LESSONS_PER_LEVEL).fill(testCase.score),
            ),
        });

        expect(level.requiredAccuracy).toBe(testCase.snapshot);
        expect(level.passedLessonCount).toBe(testCase.expected);
    });

    it('uses the master threshold if no snapshot has been saved', () => {
        const [level] = buildLevels({
            levelProgresses: [
                createLevelProgress(LEARNING_LEVEL_CODES[0], null),
            ],
            lessonProgresses: createLessonProgress([80, 80, 80, 80, 80]),
        });

        expect(level.requiredAccuracy).toBe(80);
        expect(level.passedLessonCount).toBe(5);
    });

    it('keeps lesson pass states separate for each interest', () => {
        const progress: LearningProgress = {
            levelProgresses: [],
            lessonProgresses: [
                ...createLessonProgress([100, 100, 100, 100, 100]),
                ...createLessonProgress([60, 60, 60, 60, 60], 'interest-2'),
            ],
        };

        expect(buildLevels(progress)[0].passedLessonCount).toBe(5);
        expect(buildLevels(progress, 'interest-2')[0].passedLessonCount).toBe(
            0,
        );
    });

    it('returns zero passing lessons when progress has not been created', () => {
        const [level] = buildLevels({
            levelProgresses: [],
            lessonProgresses: [],
        });

        expect(level.completedLessonCount).toBe(0);
        expect(level.passedLessonCount).toBe(0);
        expect(level.lessons.every((lesson) => !lesson.isPassed)).toBe(true);
        expect(level.isUnlocked).toBe(true);
    });

    it('preserves saved pass and unlock dates without updating progress', () => {
        const beginner = createLevelProgress(LEARNING_LEVEL_CODES[0], 80);
        beginner.completedAt = savedAt;
        beginner.passedAt = savedAt;
        const intermediate = createLevelProgress(LEARNING_LEVEL_CODES[1], null);
        const progress: LearningProgress = {
            levelProgresses: [beginner, intermediate],
            lessonProgresses: createLessonProgress([100, 100, 100, 100, 100]),
        };
        const before = JSON.stringify(progress);
        const levels = buildLevels(progress);

        expect(levels[0].passedAt).toBe(savedAt.toISOString());
        expect(levels[1].isUnlocked).toBe(true);
        expect(levels[1].unlockedAt).toBe(savedAt.toISOString());
        expect(JSON.stringify(progress)).toBe(before);
    });
});
