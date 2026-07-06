import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { STATUS_CODES } from 'node:http';
import { Request, Response } from 'express';

import { ApiErrorResponse } from '../types/api-error-response.type';
import { FieldError } from '../types/field-error.type';

type HttpExceptionResponseBody = {
    statusCode?: number;
    error?: string;
    message?: string | string[];
    details?: FieldError[];
};

const HTTP_STATUS = {
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
} as const;

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const statusCode = this.getStatusCode(exception);
        const exceptionResponse = this.getExceptionResponse(exception);

        this.logServerError(exception, request, statusCode);

        const responseBody: ApiErrorResponse = {
            statusCode,
            error: this.getError(exceptionResponse, statusCode),
            message: this.getMessage(exceptionResponse, statusCode),
            details: this.getDetails(exceptionResponse),
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        response.status(statusCode).json(responseBody);
    }

    private logServerError(
        exception: unknown,
        request: Request,
        statusCode: number,
    ): void {
        if (statusCode < HTTP_STATUS.INTERNAL_SERVER_ERROR) {
            return;
        }

        const requestLog = `${request.method} ${request.url}`;

        if (exception instanceof Error) {
            this.logger.error(requestLog, exception.stack);
            return;
        }

        this.logger.error(`${requestLog} - ${String(exception)}`);
    }

    private getStatusCode(exception: unknown): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        }

        return HTTP_STATUS.INTERNAL_SERVER_ERROR;
    }

    private getExceptionResponse(
        exception: unknown,
    ): string | HttpExceptionResponseBody {
        if (!(exception instanceof HttpException)) {
            return {
                statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error: 'Internal Server Error',
                message: 'Internal server error',
                details: [],
            };
        }

        const exceptionResponse = exception.getResponse();

        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }

        if (this.isHttpExceptionResponseBody(exceptionResponse)) {
            return exceptionResponse;
        }

        return {};
    }

    private getError(
        exceptionResponse: string | HttpExceptionResponseBody,
        statusCode: number,
    ): string {
        if (
            typeof exceptionResponse !== 'string' &&
            typeof exceptionResponse.error === 'string'
        ) {
            return exceptionResponse.error;
        }

        return STATUS_CODES[statusCode] ?? 'Error';
    }

    private getMessage(
        exceptionResponse: string | HttpExceptionResponseBody,
        statusCode: number,
    ): string {
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }

        if (typeof exceptionResponse.message === 'string') {
            return exceptionResponse.message;
        }

        if (Array.isArray(exceptionResponse.message)) {
            return statusCode === HTTP_STATUS.BAD_REQUEST
                ? 'Validation failed'
                : exceptionResponse.message.join(', ');
        }

        return statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR
            ? 'Internal server error'
            : (STATUS_CODES[statusCode] ?? 'Error');
    }

    private getDetails(
        exceptionResponse: string | HttpExceptionResponseBody,
    ): FieldError[] {
        if (
            typeof exceptionResponse !== 'string' &&
            this.isFieldErrorArray(exceptionResponse.details)
        ) {
            return exceptionResponse.details;
        }

        return [];
    }

    private isHttpExceptionResponseBody(
        value: unknown,
    ): value is HttpExceptionResponseBody {
        return typeof value === 'object' && value !== null;
    }

    private isFieldErrorArray(value: unknown): value is FieldError[] {
        return (
            Array.isArray(value) &&
            value.every((item) => {
                if (typeof item !== 'object' || item === null) {
                    return false;
                }

                const fieldError = item as Partial<FieldError>;

                return (
                    typeof fieldError.field === 'string' &&
                    Array.isArray(fieldError.messages) &&
                    fieldError.messages.every(
                        (message) => typeof message === 'string',
                    )
                );
            })
        );
    }
}
