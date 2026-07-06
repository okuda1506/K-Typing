import { FieldError } from './field-error.type';

export type ApiErrorResponse = {
    statusCode: number;
    error: string;
    message: string;
    details: FieldError[];
    path: string;
    timestamp: string;
};
