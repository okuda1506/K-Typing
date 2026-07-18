import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './types/create-user.input';
import { PublicUser } from './types/public-user.type';
import { UserWithPassword } from './types/user-with-password.type';
import type { Prisma, User } from '@prisma/client';

const publicUserSelect = {
    id: true,
    displayName: true,
    email: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.UserSelect;

const userWithPasswordSelect = {
    ...publicUserSelect,
    password: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findPublicById(id: string): Promise<PublicUser | null> {
        return this.prisma.user.findUnique({
            where: { id },
            select: publicUserSelect,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findByEmailWithPassword(
        email: string,
    ): Promise<UserWithPassword | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
            select: userWithPasswordSelect,
        });
    }

    async create(data: CreateUserInput): Promise<PublicUser> {
        return this.prisma.user.create({
            data: {
                displayName: data.displayName,
                email: data.email,
                password: data.hashedPassword,
            },
            select: publicUserSelect,
        });
    }
}
