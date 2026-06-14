import { API_BASE_URL } from '../../config/api';
import type { AuthResponse, SignInRequest, SignUpRequest } from './types';

const AUTH_API_BASE_URL = `${API_BASE_URL}/auth`;

export const signUp = async (
    data: SignUpRequest,
): Promise<AuthResponse> => {
    const response = await fetch(`${AUTH_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('サインアップに失敗しました');
    }

    return response.json() as Promise<AuthResponse>;
};

export const signIn = async (
    data: SignInRequest,
): Promise<AuthResponse> => {
    const response = await fetch(`${AUTH_API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('サインインに失敗しました');
    }

    return response.json() as Promise<AuthResponse>;
};
