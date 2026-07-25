import type { AuthResponse, AuthUser } from './types';

const AUTH_USER_STORAGE_KEY = 'authUser';
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

export const updateAuthUser = (user: AuthUser): void => {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
};

export const saveAuthSession = (authResponse: AuthResponse): void => {
    updateAuthUser(authResponse.user);
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, authResponse.accessToken);
};

export const clearAuthSession = (): void => {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const hasAuthSession = (): boolean => {
    return Boolean(getAccessToken());
};
