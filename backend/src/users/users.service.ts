import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import type { User } from '../../generated/prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaClient) {}

    // 全ユーザー取得
    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    // UUIDによる単一ユーザー取得
    async findOne(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }

    // ユーザー作成
    async create(userData: Partial<User>): Promise<User> {
        try {
            return await this.prisma.user.create({
                data: userData,
            });
        } catch (error) {
            if (error === 'P2002') {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    // ユーザーの更新
    async update(
        id: string,
        updateData: {
            name?: string;
            displayName?: string;
            email?: string;
            password?: string;
        },
    ): Promise<User> {
        return await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }

    // ユーザーの削除
    async delete(id: string): Promise<User> {
        return await this.prisma.user.delete({
            where: { id },
        });
    }
}
