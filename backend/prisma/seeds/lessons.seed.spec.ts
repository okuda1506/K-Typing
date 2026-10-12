import type { Prisma, PrismaClient } from '@prisma/client';

import { seedLessons } from './lessons.seed';

describe('seedLessons', () => {
    function createMock() {
        const levels = [
            { id: 'beginner-id', code: 'beginner' },
            { id: 'intermediate-id', code: 'intermediate' },
            { id: 'advanced-id', code: 'advanced' },
        ];
        const findMany = jest
            .fn<Promise<typeof levels>, [Prisma.LevelFindManyArgs]>()
            .mockResolvedValue(levels);
        const upsert = jest
            .fn<Promise<unknown>, [Prisma.LessonUpsertArgs]>()
            .mockResolvedValue({});
        const transaction = jest
            .fn<Promise<unknown[]>, [unknown[]]>()
            .mockResolvedValue([]);
        const prisma = {
            level: { findMany },
            lesson: { upsert },
            $transaction: transaction,
        } as unknown as PrismaClient;

        return { prisma, levels, findMany, upsert, transaction };
    }

    it('registers five ten-question lessons per level in one transaction', async () => {
        const { prisma, findMany, upsert, transaction } = createMock();

        await seedLessons(prisma);

        expect(findMany).toHaveBeenCalledWith({
            where: { code: { in: ['beginner', 'intermediate', 'advanced'] } },
            select: { id: true, code: true },
        });
        expect(upsert).toHaveBeenCalledTimes(15);
        const titles = [
            '基本単語',
            '短いフレーズ',
            '簡単な文',
            '基本表現の組み合わせ',
            '初級まとめ',
            '日常的な文',
            '質問・回答',
            '過去・予定',
            '理由・希望',
            '中級まとめ',
            '長めの文',
            '複数の節',
            '意見・説明',
            '表現の使い分け',
            '上級まとめ',
        ];
        const levelIds = ['beginner-id', 'intermediate-id', 'advanced-id'];

        upsert.mock.calls.forEach(([args], index) => {
            const levelId = levelIds[Math.floor(index / 5)];
            const orderNo = (index % 5) + 1;

            expect(args.where).toEqual({
                levelId_orderNo: { levelId, orderNo },
            });
            expect(args.create).toEqual({
                levelId,
                orderNo,
                title: titles[index],
                themeType: expect.stringMatching(
                    /^[a-z]+(?:-[a-z]+)*$/,
                ) as unknown,
                questionCount: 10,
                isActive: true,
            });
            expect(args.update).toEqual(args.create);
            expect(args.update).not.toHaveProperty('requiredAccuracy');
        });
        expect(transaction).toHaveBeenCalledTimes(1);
        expect(transaction.mock.calls[0][0]).toHaveLength(15);
    });

    it('reuses lesson keys without assigning new IDs on rerun', async () => {
        const { prisma, upsert } = createMock();

        await seedLessons(prisma);
        await seedLessons(prisma);

        expect(upsert.mock.calls.slice(15)).toEqual(
            upsert.mock.calls.slice(0, 15),
        );
        for (const [args] of upsert.mock.calls) {
            expect(args.create).not.toHaveProperty('id');
            expect(args.update).not.toHaveProperty('id');
        }
    });

    it('does not write any lessons when a parent level is missing', async () => {
        const { prisma, findMany, levels, upsert, transaction } = createMock();
        findMany.mockResolvedValueOnce(levels.slice(0, 2));

        await expect(seedLessons(prisma)).rejects.toThrow(
            'Level "advanced" is missing',
        );

        expect(upsert).not.toHaveBeenCalled();
        expect(transaction).not.toHaveBeenCalled();
    });

    it('propagates parent lookup failures without writing lessons', async () => {
        const { prisma, findMany, upsert, transaction } = createMock();
        findMany.mockRejectedValueOnce(new Error('lookup failed'));

        await expect(seedLessons(prisma)).rejects.toThrow('lookup failed');

        expect(upsert).not.toHaveBeenCalled();
        expect(transaction).not.toHaveBeenCalled();
    });

    it('propagates transaction failures', async () => {
        const { prisma, transaction } = createMock();
        transaction.mockRejectedValueOnce(new Error('transaction failed'));

        await expect(seedLessons(prisma)).rejects.toThrow('transaction failed');
    });
});
