import type { LearningLesson } from './learning-lesson.type';

export type LearningLevel = {
    id: string;
    code: string;
    title: string;
    orderNo: number;
    requiredAccuracy: number;
    isUnlocked: boolean;
    unlockedAt: string | null; // 初級は解放済みでも未保存ならnull
    startedAt: string | null;
    completedAt: string | null;
    passedAt: string | null;
    completedLessonCount: number;
    lessonCount: number;
    overallAccuracy: number | null; // 全5レッスン完了後の最高成績平均
    lessons: LearningLesson[];
};
