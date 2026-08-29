import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { OnboardingOptionsResponse } from './types/onboarding-options-response.type';
import { MAX_INTEREST_SELECTIONS } from './constants/onboarding.constants';
import { SaveOnboardingInterestsDto } from './dto/save-onboarding-interests.dto';
import { SaveOnboardingInterestsResponse } from './types/save-onboarding-interests-response.type';

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

    /**
     * 有効な興味選択肢と選択上限を取得する
     *
     * @returns オンボーディング選択肢
     */
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

    /**
     * ログインユーザーの興味設定を保存する
     *
     * @param userId ログインユーザーID
     * @param dto 選択した興味と詳細回答
     * @returns 保存した興味設定
     * @throws {BadRequestException} 存在しないまたは無効な興味が含まれる場合
     */
    async saveInterests(
        userId: string,
        dto: SaveOnboardingInterestsDto,
    ): Promise<SaveOnboardingInterestsResponse> {
        // 詳細回答の前後にある空白を削除してDB保存用の値に加工する
        const normalizedInterests = dto.interests.map((interest) => ({
            interestId: interest.interestId,
            detailAnswer: interest.detailAnswer.trim(),
        }));

        return this.prisma.$transaction(async (transaction) => {
            const activeInterests = await transaction.interest.findMany({
                where: {
                    id: {
                        in: normalizedInterests.map(
                            (interest) => interest.interestId,
                        ),
                    },
                    isActive: true,
                },
                select: {
                    id: true,
                },
            });

            const activeInterestIds = new Set(
                activeInterests.map((interest) => interest.id),
            );

            // リクエスト内の興味から存在しないまたは無効な興味を抽出する
            // indexは項目別エラーのフィールド名を作るために保持
            const invalidInterests = normalizedInterests
                .map((interest, index) => ({ interest, index }))
                .filter(
                    ({ interest }) =>
                        !activeInterestIds.has(interest.interestId),
                );

            if (invalidInterests.length > 0) {
                throw new BadRequestException({
                    message: 'Invalid interests',
                    details: invalidInterests.map(({ index }) => ({
                        field: `interests.${index}.interestId`,
                        messages: ['Interest does not exist or is inactive'],
                    })),
                });
            }

            // ログインユーザーが以前登録した興味を全て削除する
            await transaction.userInterest.deleteMany({
                where: { userId },
            });

            // 選択した興味をまとめて登録する
            await transaction.userInterest.createMany({
                data: normalizedInterests.map((interest) => ({
                    userId,
                    interestId: interest.interestId,
                    detailAnswer: interest.detailAnswer,
                })),
            });

            return {
                interests: normalizedInterests,
            };
        });
    }
}
