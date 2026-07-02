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

export type ApiErrorResponse = {
    message: string | string[];
    error: string;
    statusCode: number;
};

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

export type SignUpForm = {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type SignInForm = {
    email: string;
    password: string;
};

export type SignInFormErrors = Partial<Record<keyof SignInForm, string>>;

export type SignUpFormErrors = Partial<Record<keyof SignUpForm, string>>;
