import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersController } from './users.controller';

@Module({
    imports: [PrismaModule],
    controllers: [UsersController],
    providers: [UsersService, JwtAuthGuard],
    exports: [UsersService],
})
export class UsersModule {}
