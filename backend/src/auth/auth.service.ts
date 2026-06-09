import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { PublicUser } from '../users/types/public-user.type';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async signUp(dto: SignUpDto): Promise<PublicUser> {
        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existingUser = await this.usersService.findByEmail(dto.email);

        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10); // todo: configから読み取る

        return this.usersService.create({
            displayName: dto.displayName,
            email: dto.email,
            hashedPassword,
        });
    }
}
