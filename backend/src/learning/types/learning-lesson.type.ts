import type { LessonStatus } from './lesson-status.type';

export type LearningLesson = {
    id: string;
    title: string;
    themeType: string;
    orderNo: number;
    questionCount: number;
    status: LessonStatus;
    startedAt: string | null;
    completedAt: string | null;
    completedCount: number;
    bestAccuracy: number | null; // 未完了のnullと完了した0%を区別する
    isPassed: boolean; // 完了済みの最高正確率が、その級の合格基準以上か
};
