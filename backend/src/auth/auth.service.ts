import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponse } from './types/auth-response.type';
import { JwtPayload } from './types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { PublicUser } from '../users/types/public-user.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(dto: SignUpDto): Promise<AuthResponse> {
        const displayName = dto.displayName.trim();
        const email = dto.email.trim().toLowerCase();

        if (!displayName) {
            throw new BadRequestException('Display name is required');
        }

        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existingUser = await this.usersService.findByEmail(email);

        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const saltRounds = this.configService.get<number>(
            'bcryptSaltRounds',
            10,
        );

        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        const user = await this.usersService.create({
            displayName,
            email,
            hashedPassword,
        });

        const accessToken = await this.issueAccessToken(user);

        return {
            user,
            accessToken,
        };
    }

    async signIn(dto: SignInDto): Promise<AuthResponse> {
        const email = dto.email.trim().toLowerCase();

        const user = await this.usersService.findByEmailWithPassword(email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const accessToken = await this.issueAccessToken(user);

        return {
            user: {
                id: user.id,
                displayName: user.displayName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            accessToken,
        };
    }

    private async issueAccessToken(user: PublicUser): Promise<string> {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
        };

        return this.jwtService.signAsync(payload);
    }
}
