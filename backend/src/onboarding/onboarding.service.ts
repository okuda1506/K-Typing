import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { OnboardingOptionsResponse } from './types/onboarding-options-response.type';

const MAX_INTEREST_SELECTIONS = 3;

const interestOptionSelect = {
    id: true,
    key: true,
    labelJa: true,
    detailQuestionJa: true,
    detailPlaceholderJa: true,
} satisfies Prisma.InterestSelect;

@Injectable()
export class OnboardingService {
    constructor(private readonly prisma: PrismaService) {}

    async getOptions(): Promise<OnboardingOptionsResponse> {
        const interests = await this.prisma.interest.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                sortOrder: 'asc',
            },
            select: interestOptionSelect,
        });

        return {
            interests,
            maxSelections: MAX_INTEREST_SELECTIONS,
        };
    }
}
