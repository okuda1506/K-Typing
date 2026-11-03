import type { LearningLevel } from './learning-level.type';

export type LearningInterest = {
    id: string;
    key: string;
    labelJa: string;
    detailAnswer: string;
    canChange: boolean;
    levels: LearningLevel[];
};
