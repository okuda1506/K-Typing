import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthUser } from './types/auth-user.type';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthResponse } from './types/auth-response.type';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() dto: SignUpDto): Promise<AuthResponse> {
        return this.authService.signUp(dto);
    }

    // JWT認証動作確認用
    // @UseGuards(JwtAuthGuard)
    // @Get('me')
    // me(@Req() request: Request & { user: AuthUser }): AuthUser {
    //     return request.user;
    // }
}
