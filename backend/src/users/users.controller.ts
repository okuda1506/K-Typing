import {
    Controller,
    Get,
    NotFoundException,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/types/auth-user.type';
import { PublicUser } from './types/public-user.type';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(
        @Req() request: Request & { user: AuthUser },
    ): Promise<PublicUser> {
        const user = await this.usersService.findPublicById(request.user.id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
