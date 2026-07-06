import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    });

    // Nest全体を通してAPIエラーレスポンスを統一
    app.useGlobalFilters(new HttpExceptionFilter());

    // グローバルバリデーション設定
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO に定義されていないプロパティを除去
            forbidNonWhitelisted: true, // DTO に定義されていないプロパティがある場合にエラーとする
            transform: true, // リクエストデータを DTO クラスのインスタンスに変換
            exceptionFactory: (errors: ValidationError[]) => {
                // DTOエラーのカスタマイズ
                const details = errors.map((error) => ({
                    field: error.property,
                    messages: Object.values(error.constraints ?? {}),
                }));

                return new BadRequestException({
                    message: 'Validation failed',
                    details,
                });
            },
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
