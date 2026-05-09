import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users = [
        { id: 1, name: 'JURIN', email: 'jurin@example.com' },
        { id: 2, name: 'CHISA', email: 'chisa@example.com' },
        { id: 3, name: 'COCONA', email: 'cocona@example.com' },
    ];

    findAll() {
        return this.users;
    }

    findOne(id: number) {
        const user = this.users.find((user) => user.id === id);

        if (!user) {
            throw new NotFoundException(
                `ID ${id} のユーザーが見つかりません。`,
            );
        }

        return user;
    }

    create(createUserDto: CreateUserDto) {
        const newUser = {
            id: this.users.length + 1,
            ...createUserDto,
        };

        this.users.push(newUser);
        return newUser;
    }
}
