import { Controller, Get, Post, HttpStatus, HttpCode } from '@nestjs/common';

@Controller('api')
export class ApiController {
    @Get('health')
    healthCheck(): object {
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    @Get('version')
    getVersion(): string {
        return '1.0.0';
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(): object {
        return { id: 1 };
    }
}
