import type { Prisma, PrismaClient } from '@prisma/client';

import { seedLevels } from './levels.seed';

describe('seedLevels', () => {
    function createMock() {
        const upsert = jest
            .fn<Promise<unknown>, [Prisma.LevelUpsertArgs]>()
            .mockResolvedValue({});
        const transaction = jest
            .fn<Promise<unknown[]>, [unknown[]]>()
            .mockResolvedValue([]);
        const prisma = {
            level: { upsert },
            $transaction: transaction,
        } as unknown as PrismaClient;

        return { prisma, upsert, transaction };
    }

    it('registers three ordered levels with an accuracy threshold of 80', async () => {
        const { prisma, upsert, transaction } = createMock();

        await seedLevels(prisma);

        expect(upsert).toHaveBeenCalledTimes(3);
        const codes = ['beginner', 'intermediate', 'advanced'];
        const titles = ['初級', '中級', '上級'];

        upsert.mock.calls.forEach(([args], index) => {
            expect(args.where).toEqual({ code: codes[index] });
            expect(args.create).toEqual({
                code: codes[index],
                title: titles[index],
                difficulty: codes[index],
                orderNo: index + 1,
                description: expect.any(String) as unknown,
                requiredAccuracy: 80,
            });
            expect(args.update).toEqual({
                title: titles[index],
                difficulty: codes[index],
                orderNo: index + 1,
                description: expect.any(String) as unknown,
                requiredAccuracy: 80,
            });
        });
        expect(transaction).toHaveBeenCalledWith(
            expect.arrayContaining([expect.any(Promise)]),
        );
        expect(transaction.mock.calls[0][0]).toHaveLength(3);
    });

    it('reuses the same unique keys and never assigns new IDs on rerun', async () => {
        const { prisma, upsert } = createMock();

        await seedLevels(prisma);
        await seedLevels(prisma);

        expect(upsert.mock.calls.slice(3)).toEqual(
            upsert.mock.calls.slice(0, 3),
        );
        for (const [args] of upsert.mock.calls) {
            expect(args.create).not.toHaveProperty('id');
            expect(args.update).not.toHaveProperty('id');
        }
    });

    it('propagates transaction failures', async () => {
        const { prisma, transaction } = createMock();
        transaction.mockRejectedValueOnce(new Error('transaction failed'));

        await expect(seedLevels(prisma)).rejects.toThrow('transaction failed');
    });
});
