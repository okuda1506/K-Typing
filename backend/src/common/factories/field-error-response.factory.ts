import type { FieldError } from '../types/field-error.type';
import type { FieldErrorExceptionResponse } from '../types/field-error-exception-response.type';

/**
 * 例外に渡す項目別エラーボディを作成する
 */
export function createFieldErrorResponse(
    message: string,
    details: FieldError | FieldError[],
): FieldErrorExceptionResponse {
    return {
        message,
        details: Array.isArray(details) ? details : [details],
    };
}
