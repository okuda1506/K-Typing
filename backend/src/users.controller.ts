import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
    @Get()
    findAll(): string {
        return 'すべてのユーザーを取得';
    }

    @Get('profile')
    getProfile(): string {
        return 'ユーザーのプロフィールを取得';
    }

    @Post()
    create(): string {
        return '新しいユーザーを作成';
    }
}
