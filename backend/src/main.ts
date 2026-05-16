import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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
