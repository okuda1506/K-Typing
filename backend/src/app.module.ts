import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

import { aiConfig } from './config/ai.config';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [aiConfig, appConfig, authConfig],
        }),
        AuthModule,
        UsersModule,
        PrismaModule,
        OnboardingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
