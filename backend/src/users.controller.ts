import { Controller, Get, Param, Post, Query } from '@nestjs/common';

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

    @Get(':id')
    getFindOne(@Param('id') id: string): string {
        return `ID: ${id}のユーザーを取得`;
    }

    @Get('search')
    search(@Query() query: any): string {
        return `クエリ: ${JSON.stringify(query)} で検索`;
    }
}
