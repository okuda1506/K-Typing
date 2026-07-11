import { apiFetch } from '@/lib/apiClient';
import type { AuthResponse, SignInRequest, SignUpRequest } from './types';

export function signUp(data: SignUpRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function signIn(data: SignInRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
