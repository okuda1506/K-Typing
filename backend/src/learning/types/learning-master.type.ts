import type { Level, Lesson } from '@prisma/client';

type LessonMaster = Pick<
    Lesson,
    'id' | 'title' | 'themeType' | 'orderNo' | 'questionCount'
>;
export type LearningMaster = Pick<
    Level,
    'id' | 'code' | 'title' | 'orderNo' | 'requiredAccuracy'
> & { lessons: LessonMaster[] };
