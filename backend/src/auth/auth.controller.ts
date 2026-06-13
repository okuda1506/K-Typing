import { Body, Controller, Post } from '@nestjs/common';

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
}
