import { Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import type { LessonProgress, UserLevelProgress } from '@prisma/client';
import request from 'supertest';
import type { App } from 'supertest/types';

import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import {
    LEARNING_LEVEL_CODES,
    LESSONS_PER_LEVEL,
    QUESTIONS_PER_LESSON,
} from '../src/learning/constants/learning.constants';
import { LearningModule } from '../src/learning/learning.module';
import type { LearningMaster } from '../src/learning/types/learning-master.type';
import type { LearningOverviewResponse } from '../src/learning/types/learning-overview-response.type';
import type { SelectedInterest } from '../src/learning/types/selected-interest.type';
import { PrismaService } from '../src/prisma/prisma.service';

const userId = 'user-1';
const savedAt = new Date('2026-11-01T00:00:00.000Z');
const secret = 'learning-api-test-only-secret';
const selectedInterests: SelectedInterest[] = [
    {
        interest: { id: 'interest-1', key: 'k-pop', labelJa: 'K-POP' },
        detailAnswer: 'aespa',
    },
    {
        interest: { id: 'interest-2', key: 'travel', labelJa: '韓国旅行' },
        detailAnswer: 'ソンス',
    },
];

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

describe('GET /learning/overview (HTTP with mocked database)', () => {
    let app: INestApplication<App>;
    let jwt: JwtService;
    let token: string;
    const prisma = {
        user: { findUnique: jest.fn() },
        level: { findMany: jest.fn() },
        userLevelProgress: { findMany: jest.fn() },
        lessonProgress: { findMany: jest.fn() },
    };

    beforeEach(async () => {
        jest.resetAllMocks();
        prisma.user.findUnique.mockResolvedValue({
            id: userId,
            interests: selectedInterests,
        });
        prisma.level.findMany.mockResolvedValue(createMasters());
        prisma.userLevelProgress.findMany.mockResolvedValue([]);
        prisma.lessonProgress.findMany.mockResolvedValue([]);

        const module = await Test.createTestingModule({
            imports: [
                LearningModule,
                PassportModule,
                JwtModule.register({ secret }),
            ],
            providers: [
                JwtStrategy,
                {
                    provide: ConfigService,
                    useValue: new ConfigService({ jwtSecret: secret }),
                },
            ],
        })
            .overrideProvider(PrismaService)
            .useValue(prisma)
            .compile();

        app = module.createNestApplication();
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
        jwt = module.get(JwtService);
        token = jwt.sign({ sub: userId, email: 'learner@example.com' });
    });

    afterEach(async () => {
        await app.close();
        jest.restoreAllMocks();
    });

    it('returns the selected interests and initial lesson states', async () => {
        const response = await request(app.getHttpServer())
            .get('/learning/overview')
            .auth(token, { type: 'bearer' })
            .expect(200);
        const body = response.body as LearningOverviewResponse;

        expect(Object.keys(body)).toEqual(['interests']);
        expect(body.interests.map((interest) => interest.detailAnswer)).toEqual(
            ['aespa', 'ソンス'],
        );
        for (const interest of body.interests) {
            expect(interest.canChange).toBe(true);
            expect(interest.levels.map((level) => level.code)).toEqual(
                LEARNING_LEVEL_CODES,
            );
            interest.levels.forEach((level, levelIndex) => {
                expect(level.isUnlocked).toBe(levelIndex === 0);
                expect(level.unlockedAt).toBeNull();
                expect(level.requiredAccuracy).toBe(80);
                expect(level.completedLessonCount).toBe(0);
                expect(level.passedLessonCount).toBe(0);
                expect(level.lessons).toHaveLength(LESSONS_PER_LEVEL);
                level.lessons.forEach((lesson, lessonIndex) => {
                    expect(lesson.questionCount).toBe(QUESTIONS_PER_LESSON);
                    expect(lesson.status).toBe(
                        levelIndex === 0 && lessonIndex === 0
                            ? 'available'
                            : 'locked',
                    );
                    expect(lesson.bestAccuracy).toBeNull();
                    expect(lesson.isPassed).toBe(false);
                });
            });
            expect(interest).not.toHaveProperty('prompt');
            expect(interest).not.toHaveProperty('password');
        }
    });

    it('returns an empty list without querying masters for an unconfigured user', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: userId, interests: [] });

        await request(app.getHttpServer())
            .get('/learning/overview')
            .auth(token, { type: 'bearer' })
            .expect(200)
            .expect({ interests: [] });

        expect(prisma.level.findMany).not.toHaveBeenCalled();
        expect(prisma.userLevelProgress.findMany).not.toHaveBeenCalled();
        expect(prisma.lessonProgress.findMany).not.toHaveBeenCalled();
    });

    it.each(['missing', 'malformed', 'wrong-signature', 'expired'])(
        'rejects a %s JWT with the shared 401 response',
        async (kind) => {
            const get = request(app.getHttpServer()).get('/learning/overview');
            if (kind !== 'missing') {
                const invalidToken =
                    kind === 'expired'
                        ? jwt.sign({ sub: userId }, { expiresIn: -1 })
                        : kind === 'wrong-signature'
                          ? new JwtService({ secret: 'different-secret' }).sign(
                                {
                                    sub: userId,
                                },
                            )
                          : 'invalid-token';
                get.auth(invalidToken, { type: 'bearer' });
            }

            const response = await get.expect(401);
            expect(response.body).toMatchObject({
                statusCode: 401,
                error: 'Unauthorized',
                message: 'Unauthorized',
                details: [],
                path: '/learning/overview',
            });
            expect(response.body).toHaveProperty(
                'timestamp',
                expect.any(String),
            );
            expect(prisma.user.findUnique).not.toHaveBeenCalled();
        },
    );

    it('returns the shared 404 response for a deleted user', async () => {
        prisma.user.findUnique.mockResolvedValue(null);

        const response = await request(app.getHttpServer())
            .get('/learning/overview')
            .auth(token, { type: 'bearer' })
            .expect(404);

        expect(response.body).toMatchObject({
            statusCode: 404,
            error: 'Not Found',
            message: 'User not found',
            details: [],
            path: '/learning/overview',
        });
        expect(response.body).toHaveProperty('timestamp', expect.any(String));
        expect(prisma.level.findMany).not.toHaveBeenCalled();
    });

    it('scopes all lookups to the JWT user and selected interests, ignoring a query userId', async () => {
        await request(app.getHttpServer())
            .get('/learning/overview?userId=other-user')
            .auth(token, { type: 'bearer' })
            .expect(200);

        expect(prisma.user.findUnique.mock.calls).toMatchObject([
            [
                {
                    where: { id: userId },
                    select: {
                        interests: {
                            where: { interest: { isActive: true } },
                            orderBy: [
                                { interest: { sortOrder: 'asc' } },
                                { interestId: 'asc' },
                            ],
                        },
                    },
                },
            ],
        ]);
        for (const lookup of [
            prisma.userLevelProgress.findMany,
            prisma.lessonProgress.findMany,
        ]) {
            expect(lookup.mock.calls).toMatchObject([
                [
                    {
                        where: {
                            userId,
                            interestId: { in: ['interest-1', 'interest-2'] },
                        },
                    },
                ],
            ]);
            expect(lookup).toHaveBeenCalledTimes(1);
        }
    });

    it.each(['missing-level', 'missing-lesson', 'wrong-order', 'wrong-count'])(
        'logs and returns a shared 500 for %s without inventing masters',
        async (kind) => {
            const log = jest
                .spyOn(Logger.prototype, 'error')
                .mockImplementation();
            const masters = createMasters();
            if (kind === 'missing-level') masters.pop();
            if (kind === 'missing-lesson') masters[0].lessons.pop();
            if (kind === 'wrong-order') masters[0].lessons[0].orderNo = 2;
            if (kind === 'wrong-count') masters[0].lessons[0].questionCount = 9;
            prisma.level.findMany.mockResolvedValue(masters);

            const response = await request(app.getHttpServer())
                .get('/learning/overview')
                .auth(token, { type: 'bearer' })
                .expect(500);

            expect(response.body).toMatchObject({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'Learning configuration is invalid',
                details: [],
                path: '/learning/overview',
            });
            expect(response.body).toHaveProperty(
                'timestamp',
                expect.any(String),
            );
            expect(log).toHaveBeenCalled();
            expect(prisma.lessonProgress.findMany).not.toHaveBeenCalled();
        },
    );

    it.each([false, true])(
        'keeps genre progress separate and uses grade completion=%s for canChange',
        async (completed) => {
            const levelProgress: UserLevelProgress = {
                userId,
                interestId: 'interest-1',
                levelId: 'beginner',
                unlockedAt: savedAt,
                startedAt: savedAt,
                completedAt: completed ? savedAt : null,
                passedAt: completed ? savedAt : null,
                detailAnswerSnapshot: 'aespa',
                requiredAccuracySnapshot: new Prisma.Decimal(80),
                createdAt: savedAt,
                updatedAt: savedAt,
            };
            const lessonProgresses: LessonProgress[] = Array.from(
                { length: completed ? LESSONS_PER_LEVEL : 1 },
                (_, index) => ({
                    userId,
                    interestId: 'interest-1',
                    lessonId: `beginner-${index + 1}`,
                    generatedBatchId: null,
                    startedAt: savedAt,
                    completedAt: savedAt,
                    bestAccuracy: new Prisma.Decimal(80),
                    bestWpm: new Prisma.Decimal(0),
                    completedCount: 1,
                    createdAt: savedAt,
                    updatedAt: savedAt,
                }),
            );
            prisma.userLevelProgress.findMany.mockResolvedValue([
                levelProgress,
            ]);
            prisma.lessonProgress.findMany.mockResolvedValue(lessonProgresses);

            const get = async (): Promise<LearningOverviewResponse> => {
                const response = await request(app.getHttpServer())
                    .get('/learning/overview')
                    .auth(token, { type: 'bearer' })
                    .expect(200);
                return response.body as LearningOverviewResponse;
            };
            const body = await get();
            const [kPop, travel] = body.interests;

            expect(kPop.canChange).toBe(completed);
            expect(kPop.levels[0].startedAt).toBe(savedAt.toISOString());
            expect(kPop.levels[0].completedLessonCount).toBe(
                lessonProgresses.length,
            );
            expect(kPop.levels[0].lessons[0].bestAccuracy).toBe(80);
            expect(kPop.levels[0].lessons[0].status).toBe('completed');
            expect(travel.canChange).toBe(true);
            expect(travel.levels[0].completedLessonCount).toBe(0);
            expect(travel.levels[0].lessons[0].status).toBe('available');
            expect(await get()).toEqual(body);
        },
    );
});
