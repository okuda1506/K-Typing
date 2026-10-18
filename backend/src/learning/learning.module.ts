import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { LearningService } from './learning.service';

@Module({
    imports: [PrismaModule],
    providers: [LearningService],
})
export class LearningModule {}
