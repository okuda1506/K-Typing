import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/features/auth/authSession';

type FieldError = {
    field: string;
    messages: string[];
};

type ApiErrorResponse = {
    statusCode: number;
    error?: string;
    message: string | string[];
    details?: FieldError[];
    path?: string;
    timestamp?: string;
};

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

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
        headers: buildJsonHeaders(options.headers, options.body),
    });

    return handleApiResponse<T>(response);
}

export async function authenticatedApiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const accessToken = getAccessToken();
    const headers = buildJsonHeaders(options.headers, options.body);

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        notifyUnauthorized();
    }

    return handleApiResponse<T>(response);
}

/**
 * 認証必須APIで401が発生した際に実行する処理を登録する関数
 *
 * APIクライアントはReact Routerへ依存しないため
 * セッション削除・Toast表示・サインイン画面への遷移は
 * 呼び出し側のAuthSessionMonitorで実装する
 *
 * 戻り値: コンポーネントのアンマウント時に呼ぶ登録解除関数
 */
export function registerUnauthorizedHandler(
    handler: UnauthorizedHandler,
): () => void {
    unauthorizedHandler = handler;

    return () => {
        // 新しく登録されたHandlerを古いcleanup処理で消さないための確認
        if (unauthorizedHandler === handler) {
            unauthorizedHandler = null;
        }
    };
}

// 認証必須APIで401が返ったときに登録済みのログアウト処理を実行する(handlerが未登録の場合は何もしない)
function notifyUnauthorized(): void {
    unauthorizedHandler?.();
}

function buildJsonHeaders(
    headers?: HeadersInit,
    body?: BodyInit | null,
): Headers {
    const nextHeaders = new Headers(headers);

    if (!nextHeaders.has('Content-Type') && !isFormData(body)) {
        nextHeaders.set('Content-Type', 'application/json');
    }

    return nextHeaders;
}

function isFormData(body: BodyInit | null | undefined): body is FormData {
    return typeof FormData !== 'undefined' && body instanceof FormData;
}

// APIレスポンスが想定したエラー形式かをチェックする
function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const response = value as Partial<ApiErrorResponse>;

    return (
        typeof response.statusCode === 'number' &&
        isMessage(response.message) &&
        (response.error === undefined || typeof response.error === 'string') &&
        (response.details === undefined || isFieldErrors(response.details)) &&
        (response.path === undefined || typeof response.path === 'string') &&
        (response.timestamp === undefined ||
            typeof response.timestamp === 'string')
    );
}

function isMessage(value: unknown): value is string | string[] {
    return (
        typeof value === 'string' ||
        (Array.isArray(value) &&
            value.every((message) => typeof message === 'string'))
    );
}

function isFieldErrors(value: unknown): value is FieldError[] {
    return (
        Array.isArray(value) &&
        value.every((fieldError) => {
            if (!fieldError || typeof fieldError !== 'object') {
                return false;
            }

            const response = fieldError as Partial<FieldError>;

            return (
                typeof response.field === 'string' &&
                Array.isArray(response.messages) &&
                response.messages.every(
                    (message) => typeof message === 'string',
                )
            );
        })
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
                responseBody.error ?? 'API Error',
                toMessages(responseBody.message),
                responseBody.details ?? [],
            );
        }

        throw new Error('Unexpected API error');
    }

    return responseBody as T;
}

function toMessages(message: string | string[]): string[] {
    return Array.isArray(message) ? message : [message];
}
