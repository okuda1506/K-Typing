import { API_BASE_URL } from '../../config/api';
import type {
    ApiErrorResponse,
    AuthResponse,
    SignInRequest,
    SignUpRequest,
} from './types';

const AUTH_API_BASE_URL = `${API_BASE_URL}/auth`;

export class ApiError extends Error {
    readonly statusCode: number;
    readonly error: string;
    readonly messages: string[];

    constructor(
        statusCode: number,
        error: string,
        messages: string[],
    ) {
        super(messages.join('\n'));
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.error = error;
        this.messages = messages;
    }
}

export async function signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return handleApiResponse<AuthResponse>(response);
}

export async function signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return handleApiResponse<AuthResponse>(response);
}

async function handleApiResponse<T>(response: Response): Promise<T> {
    const responseBody: unknown = await response.json();

    if (!response.ok) {
        if (isApiErrorResponse(responseBody)) {
            throw new ApiError(
                responseBody.statusCode,
                responseBody.error,
                toMessages(responseBody.message),
            );
        }

        throw new Error('Unexpected API error');
    }

    return responseBody as T;
}

// APIレスポンスが想定したエラー形式かをチェックする
function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const response = value as Partial<ApiErrorResponse>;

    return (
        typeof response.statusCode === 'number' &&
        typeof response.error === 'string' &&
        (typeof response.message === 'string' || Array.isArray(response.message))
    );
}

function toMessages(message: string | string[]): string[] {
    return Array.isArray(message) ? message : [message];
}
