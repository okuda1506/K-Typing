export type SignUpRequest = {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type SignInRequest = {
    email: string;
    password: string;
};

export type AuthUser = {
    id: string;
    displayName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};

export type AuthResponse = {
    user: AuthUser;
    accessToken: string;
};
