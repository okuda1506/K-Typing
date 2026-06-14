import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserInput } from './types/create-user.input';
import { PublicUser } from './types/public-user.type';
import { UserWithPassword } from './types/user-with-password.type';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

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
            select: {
                id: true,
                displayName: true,
                email: true,
                password: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async create(data: CreateUserInput): Promise<PublicUser> {
        return this.prisma.user.create({
            data: {
                displayName: data.displayName,
                email: data.email,
                password: data.hashedPassword,
            },
            select: {
                id: true,
                displayName: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
