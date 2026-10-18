import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

/** 学習構成とユーザー進捗の取得・整形を行う */
@Injectable()
export class LearningService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * 本人の存在を確認して有効な選択興味を取得する
     * @param userId ログインユーザーID
     * @throws {NotFoundException} ユーザーが存在しない場合
     */
    private async getSelectedInterests(userId: string) {
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
}
