import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    });

    // グローバルバリデーション設定
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO に定義されていないプロパティを除去
            forbidNonWhitelisted: true, // DTO に定義されていないプロパティがある場合にエラーとする
            transform: true, // リクエストデータを DTO クラスのインスタンスに変換
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
