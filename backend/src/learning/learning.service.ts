import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    LEARNING_LEVEL_CODES,
    LESSONS_PER_LEVEL,
    QUESTIONS_PER_LESSON,
} from './constants/learning.constants';
import type { SelectedInterest } from './types/selected-interest.type';
import type { LearningMaster } from './types/learning-master.type';

/** 学習構成とユーザー進捗の取得・整形を行う */
@Injectable()
export class LearningService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * 本人の存在を確認して有効な選択興味を取得する
     *
     * @param userId ログインユーザーID
     *
     * @returns 有効な選択興味と詳細回答の配列
     * @throws {NotFoundException} ユーザーが存在しない場合
     */
    private async getSelectedInterests(
        userId: string,
    ): Promise<SelectedInterest[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                interests: {
                    where: {
                        interest: { isActive: true },
                    },
                    orderBy: [
                        { interest: { sortOrder: 'asc' } },
                        { interestId: 'asc' },
                    ],
                    select: {
                        detailAnswer: true,
                        interest: {
                            select: {
                                id: true,
                                key: true,
                                labelJa: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.interests;
    }

    /**
     * PoC対象の3級（初級・中級・上級）・15レッスンを取得して構成不備を検出する
     *
     * @returns PoC対象の級とレッスン
     * @throws {InternalServerErrorException} 必須マスタが不足・不正な場合
     */
    private async getLearningMasters(): Promise<LearningMaster[]> {
        const levels = await this.prisma.level.findMany({
            where: { code: { in: LEARNING_LEVEL_CODES } },
            orderBy: [{ orderNo: 'asc' }, { id: 'asc' }],
            select: {
                id: true,
                code: true,
                title: true,
                orderNo: true,
                requiredAccuracy: true,
                lessons: {
                    where: {
                        isActive: true,
                        orderNo: { gte: 1, lte: LESSONS_PER_LEVEL },
                    },
                    orderBy: [{ orderNo: 'asc' }, { id: 'asc' }],
                    select: {
                        id: true,
                        title: true,
                        themeType: true,
                        orderNo: true,
                        questionCount: true,
                    },
                },
            },
        });

        const isValid =
            levels.length === LEARNING_LEVEL_CODES.length &&
            levels.every(
                (level, index) =>
                    level.code === LEARNING_LEVEL_CODES[index] &&
                    level.orderNo === index + 1 &&
                    level.lessons.length === LESSONS_PER_LEVEL &&
                    level.lessons.every(
                        (lesson, lessonIndex) =>
                            lesson.orderNo === lessonIndex + 1 &&
                            lesson.questionCount === QUESTIONS_PER_LESSON,
                    ),
            );

        if (!isValid) {
            throw new InternalServerErrorException(
                'Learning configuration is invalid',
            );
        }

        return levels;
    }
}
