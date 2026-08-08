import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const interestSeeds = [
    {
        key: 'k-pop',
        labelJa: 'K-POP',
        detailQuestionJa: '好きなアーティスト',
        detailPlaceholderJa: '例: NewJeans、BTS',
        sortOrder: 1,
        isActive: true,
    },
    {
        key: 'drama',
        labelJa: '韓国ドラマ',
        detailQuestionJa: '好きなドラマ・俳優',
        detailPlaceholderJa: '例: 涙の女王、キム・スヒョン',
        sortOrder: 2,
        isActive: true,
    },
    {
        key: 'travel',
        labelJa: '韓国旅行',
        detailQuestionJa: '行ってみたい韓国の場所',
        detailPlaceholderJa: '例: ソウル、釜山',
        sortOrder: 3,
        isActive: true,
    },
    {
        key: 'food',
        labelJa: '韓国料理',
        detailQuestionJa: '好きな韓国料理・食べてみたい料理',
        detailPlaceholderJa: '例: サムギョプサル、トッポッキ',
        sortOrder: 4,
        isActive: true,
    },
    {
        key: 'beauty-fashion',
        labelJa: '美容・ファッション',
        detailQuestionJa: '興味のある韓国ブランド・アイテム',
        detailPlaceholderJa: '例: 韓国コスメ、ストリートファッション',
        sortOrder: 5,
        isActive: true,
    },
    {
        key: 'daily',
        labelJa: '日常会話',
        detailQuestionJa: '学習したい日常の場面',
        detailPlaceholderJa: '例: カフェ、買い物',
        sortOrder: 6,
        isActive: true,
    },
];

async function main() {
    for (const { key, ...data } of interestSeeds) {
        await prisma.interest.upsert({
            where: {
                key,
            },
            update: data,
            create: {
                key,
                ...data,
            },
        });
    }
}

main()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
