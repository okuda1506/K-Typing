import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { PublicUser } from '../users/types/public-user.type';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() dto: SignUpDto): Promise<PublicUser> {
        return this.authService.signUp(dto);
    }
}
