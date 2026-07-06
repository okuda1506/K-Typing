import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import type { FieldError } from './common/types/field-error.type';

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
                return new BadRequestException({
                    message: 'Validation failed',
                    details: formatValidationErrors(errors),
                });
            },
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

function formatValidationErrors(
    validationErrors: ValidationError[],
    parentPath = '',
): FieldError[] {
    return validationErrors.flatMap((error) => {
        const fieldPath = parentPath
            ? `${parentPath}.${error.property}`
            : error.property;
        const messages = Object.values(error.constraints ?? {});
        const currentErrors =
            messages.length > 0
                ? [
                      {
                          field: fieldPath,
                          messages,
                      },
                  ]
                : [];
        const childErrors = formatValidationErrors(
            error.children ?? [],
            fieldPath,
        );

        return [...currentErrors, ...childErrors];
    });
}
