import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
    private users = [
        { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
        { id: 2, name: '佐藤花子', email: 'sato@example.com' },
    ];

    @Get()
    getHello(): string {
        return 'Hello World!';
    }

    @Get('get_users')
    findAll(): any[] {
        return this.users;
    }

    @Get('count')
    getCount(): { count: number } {
        return { count: this.users.length };
    }
}

