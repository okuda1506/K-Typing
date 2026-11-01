import type { LearningLesson } from './learning-lesson.type';

export type LearningLevel = {
    id: string;
    code: string;
    title: string;
    orderNo: number;
    requiredAccuracy: number; // 級内の各レッスンに適用する共通の合格基準
    isUnlocked: boolean;
    unlockedAt: string | null; // 初級は解放済みでも未保存ならnull
    startedAt: string | null;
    completedAt: string | null;
    passedAt: string | null;
    completedLessonCount: number;
    passedLessonCount: number; // 全5レッスンの合格が次級解放の条件
    lessonCount: number;
    lessons: LearningLesson[];
};
