import type { PrismaClient } from '@prisma/client';

const lessonSeeds = [
    {
        levelCode: 'beginner',
        lessons: [
            { orderNo: 1, title: '基本単語', themeType: 'basic-vocabulary' },
            { orderNo: 2, title: '短いフレーズ', themeType: 'short-phrases' },
            { orderNo: 3, title: '簡単な文', themeType: 'simple-sentences' },
            {
                orderNo: 4,
                title: '基本表現の組み合わせ',
                themeType: 'basic-expression-combinations',
            },
            { orderNo: 5, title: '初級まとめ', themeType: 'beginner-review' },
        ],
    },
    {
        levelCode: 'intermediate',
        lessons: [
            {
                orderNo: 1,
                title: '日常的な文',
                themeType: 'everyday-sentences',
            },
            {
                orderNo: 2,
                title: '質問・回答',
                themeType: 'questions-and-answers',
            },
            { orderNo: 3, title: '過去・予定', themeType: 'past-and-plans' },
            {
                orderNo: 4,
                title: '理由・希望',
                themeType: 'reasons-and-wishes',
            },
            {
                orderNo: 5,
                title: '中級まとめ',
                themeType: 'intermediate-review',
            },
        ],
    },
    {
        levelCode: 'advanced',
        lessons: [
            { orderNo: 1, title: '長めの文', themeType: 'longer-sentences' },
            { orderNo: 2, title: '複数の節', themeType: 'multiple-clauses' },
            {
                orderNo: 3,
                title: '意見・説明',
                themeType: 'opinions-and-explanations',
            },
            {
                orderNo: 4,
                title: '表現の使い分け',
                themeType: 'expression-choice',
            },
            { orderNo: 5, title: '上級まとめ', themeType: 'advanced-review' },
        ],
    },
];

/** 級ごとの5レッスンを登録・更新し、既存のIDと履歴参照を維持する。 */
export async function seedLessons(prisma: PrismaClient): Promise<void> {
    const levels = await prisma.level.findMany({
        where: { code: { in: lessonSeeds.map(({ levelCode }) => levelCode) } },
        select: { id: true, code: true },
    });
    const levelIds = new Map(levels.map(({ id, code }) => [code, id]));

    // 親の級が揃っていることを確認してから、レッスンを一括で更新する。
    const lessons = lessonSeeds.flatMap(({ levelCode, lessons }) => {
        const levelId = levelIds.get(levelCode);

        if (!levelId) {
            throw new Error(
                `Level "${levelCode}" is missing. Run seedLevels first.`,
            );
        }

        return lessons.map((lesson) => ({
            levelId,
            ...lesson,
            questionCount: 10,
            isActive: true,
        }));
    });

    await prisma.$transaction(
        lessons.map((data) =>
            prisma.lesson.upsert({
                where: {
                    levelId_orderNo: {
                        levelId: data.levelId,
                        orderNo: data.orderNo,
                    },
                },
                update: data,
                create: data,
            }),
        ),
    );
}
