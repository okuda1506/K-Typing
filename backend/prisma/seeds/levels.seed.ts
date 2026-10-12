import type { PrismaClient } from '@prisma/client';

const levelSeeds = [
    {
        code: 'beginner',
        title: '初級',
        orderNo: 1,
        difficulty: 'beginner',
        description:
            '基本単語から短いフレーズ・簡単な文へ進み、基本表現を組み合わせて学ぶ。',
        requiredAccuracy: 80,
    },
    {
        code: 'intermediate',
        title: '中級',
        orderNo: 2,
        difficulty: 'intermediate',
        description:
            '日常的な文、質問・回答、過去・予定、理由・希望を表す文を学ぶ。',
        requiredAccuracy: 80,
    },
    {
        code: 'advanced',
        title: '上級',
        orderNo: 3,
        difficulty: 'advanced',
        description:
            '長めの文、複数の節、意見・説明、場面に応じた表現の使い分けを学ぶ。',
        requiredAccuracy: 80,
    },
];

/** 級のcodeをキーに登録・更新し、再実行時もIDを維持する。 */
export async function seedLevels(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction(
        levelSeeds.map(({ code, ...data }) =>
            prisma.level.upsert({
                where: { code },
                update: data,
                create: { code, ...data },
            }),
        ),
    );
}
