import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { PublicUser } from '../users/types/public-user.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {}

    async signUp(dto: SignUpDto): Promise<PublicUser> {
        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existingUser = await this.usersService.findByEmail(dto.email);

        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const saltRounds = this.configService.get<number>(
            'bcryptSaltRounds',
            10,
        );

        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        return this.usersService.create({
            displayName: dto.displayName,
            email: dto.email,
            hashedPassword,
        });
    }
}
