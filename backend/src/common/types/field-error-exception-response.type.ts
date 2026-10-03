import { FieldError } from './field-error.type';

export type FieldErrorExceptionResponse = {
    message: string;
    details: FieldError[];
};
