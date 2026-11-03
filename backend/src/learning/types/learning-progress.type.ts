import type { UserLevelProgress, LessonProgress } from '@prisma/client';

export type LearningProgress = {
    levelProgresses: UserLevelProgress[];
    lessonProgresses: LessonProgress[];
};
