import { PrismaClient } from '@prisma/client';

import { seedInterests } from './seeds/interests.seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    // NOTE: 外部キー制約を満たすため親マスタから依存データの順にseedすること
    await seedInterests(prisma);
}

main()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
