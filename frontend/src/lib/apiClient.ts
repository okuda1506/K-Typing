import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/features/auth/authSession';

type FieldError = {
    field: string;
    messages: string[];
};

type ApiErrorResponse = {
    statusCode: number;
    error: string;
    message: string | string[];
    details: FieldError[];
    path: string;
    timestamp: string;
};

export class ApiError extends Error {
    readonly statusCode: number;
    readonly error: string;
    readonly messages: string[];
    readonly details: FieldError[];

    constructor(
        statusCode: number,
        error: string,
        messages: string[],
        details: FieldError[],
    ) {
        super(messages.join('\n'));
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.error = error;
        this.messages = messages;
        this.details = details;
    }
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: buildJsonHeaders(options.headers),
    });

    return handleApiResponse<T>(response);
}

export async function authenticatedApiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const accessToken = getAccessToken();
    const headers = buildJsonHeaders(options.headers);

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    return handleApiResponse<T>(response);
}

function buildJsonHeaders(headers?: HeadersInit): Headers {
    const nextHeaders = new Headers(headers);

    if (!nextHeaders.has('Content-Type')) {
        nextHeaders.set('Content-Type', 'application/json');
    }

    return nextHeaders;
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
        (typeof response.message === 'string' ||
            Array.isArray(response.message)) &&
        Array.isArray(response.details) &&
        typeof response.path === 'string' &&
        typeof response.timestamp === 'string'
    );
}

async function handleApiResponse<T>(response: Response): Promise<T> {
    let responseBody: unknown;

    try {
        responseBody = await response.json();
    } catch {
        // HTMLや空レスポンスの場合は、下の汎用エラーへフォールバックする
    }

    if (!response.ok) {
        if (isApiErrorResponse(responseBody)) {
            throw new ApiError(
                responseBody.statusCode,
                responseBody.error,
                toMessages(responseBody.message),
                responseBody.details,
            );
        }

        throw new Error('Unexpected API error');
    }

    return responseBody as T;
}

function toMessages(message: string | string[]): string[] {
    return Array.isArray(message) ? message : [message];
}
