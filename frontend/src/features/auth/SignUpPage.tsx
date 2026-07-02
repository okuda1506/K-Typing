import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ApiError, signUp } from './authApi';
import type { SignUpForm, SignUpFormErrors } from './types';
import { saveAuthSession } from './authSession';
import { toast } from 'sonner';

const initialForm: SignUpForm = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export function SignUpPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<SignUpFormErrors>({});

    function updateField(field: keyof SignUpForm, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setFormErrors((current) => {
            if (!current[field] && !(field === 'password' && current.confirmPassword)) {
                return current;
            }

            const next = { ...current };
            delete next[field];

            if (field === 'password') {
                delete next.confirmPassword;
            }

            return next;
        });
    }

    function validateForm(): SignUpFormErrors {
        const errors: SignUpFormErrors = {};

        if (!form.displayName.trim()) {
            errors.displayName = '名前を入力してください';
        }

        if (!form.email.trim()) {
            errors.email = 'メールアドレスを入力してください';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'メールアドレスの形式を確認してください';
        }

        if (!form.password) {
            errors.password = 'パスワードを入力してください';
        } else if (form.password.length < 8) {
            errors.password = 'パスワードは8文字以上で入力してください';
        }

        if (form.password !== form.confirmPassword) {
            errors.confirmPassword = '確認用パスワードが一致していません';
        }

        return errors;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setFormErrors({});

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            setIsSubmitting(false);

            return;
        }

        try {
            const response = await signUp({
                displayName: form.displayName,
                email: form.email,
                password: form.password,
                confirmPassword: form.confirmPassword,
            });

            saveAuthSession(response);

            toast.success('アカウントを作成しました');

            navigate('/onboarding', { replace: true });
        } catch (error) {
            if (isEmailAlreadyInUseError(error)) {
                setFormErrors({
                    email: 'このメールアドレスはすでに使用されています',
                });
                setIsSubmitting(false);

                return;
            }

            toast.error('サインアップに失敗しました');
            setIsSubmitting(false);
        }
    };

    return (
        <section className="page-card auth-page">
            <div className="auth-layout">
                <header className="page-header auth-copy" data-reveal>
                    <p className="eyebrow">Create account</p>
                    <h1 className="auth-title">
                        <span>한 글자씩</span>
                        <span>정확하게</span>
                    </h1>
                    <p>韓国語を、正確に打つ。</p>
                </header>

                <form
                    className="auth-card-form reveal-delay-1"
                    onSubmit={handleSubmit}
                    noValidate
                    data-reveal
                >
                    <Card className="ring-[var(--line)] bg-white/80 shadow-[0_18px_48px_rgba(32,37,42,0.08)] backdrop-blur">
                        <CardHeader className="border-b border-[var(--line)]">
                            <CardTitle className="text-[16px] font-semibold text-[var(--black)]">
                                サインアップ
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="grid pt-1">
                            <label className="field auth-field">
                                <span>名前</span>
                                <input
                                    value={form.displayName}
                                    onChange={(event) =>
                                        updateField('displayName', event.target.value)
                                    }
                                    type="text"
                                    autoComplete="nickname"
                                    aria-invalid={Boolean(formErrors.displayName)}
                                    aria-describedby={
                                        formErrors.displayName
                                            ? 'signup-display-name-error'
                                            : undefined
                                    }
                                />
                                {formErrors.displayName ? (
                                    <p
                                        id="signup-display-name-error"
                                        className="field-message"
                                    >
                                        {formErrors.displayName}
                                    </p>
                                ) : null}
                            </label>

                            <label className="field auth-field">
                                <span>メールアドレス</span>
                                <input
                                    value={form.email}
                                    onChange={(event) =>
                                        updateField('email', event.target.value)
                                    }
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    aria-invalid={Boolean(formErrors.email)}
                                    aria-describedby={
                                        formErrors.email
                                            ? 'signup-email-error'
                                            : undefined
                                    }
                                />
                                {formErrors.email ? (
                                    <p
                                        id="signup-email-error"
                                        className="field-message"
                                    >
                                        {formErrors.email}
                                    </p>
                                ) : null}
                            </label>

                            <label className="field auth-field">
                                <span>パスワード</span>
                                <input
                                    value={form.password}
                                    onChange={(event) =>
                                        updateField('password', event.target.value)
                                    }
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="8文字以上"
                                    aria-invalid={Boolean(formErrors.password)}
                                    aria-describedby={
                                        formErrors.password
                                            ? 'signup-password-error'
                                            : undefined
                                    }
                                />
                                {formErrors.password ? (
                                    <p
                                        id="signup-password-error"
                                        className="field-message"
                                    >
                                        {formErrors.password}
                                    </p>
                                ) : null}
                            </label>

                            <label className="field auth-field">
                                <span>パスワード確認</span>
                                <input
                                    value={form.confirmPassword}
                                    onChange={(event) =>
                                        updateField(
                                            'confirmPassword',
                                            event.target.value,
                                        )
                                    }
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="もう一度入力"
                                    aria-invalid={Boolean(
                                        formErrors.confirmPassword,
                                    )}
                                    aria-describedby={
                                        formErrors.confirmPassword
                                            ? 'signup-confirm-password-error'
                                            : undefined
                                    }
                                />
                                {formErrors.confirmPassword ? (
                                    <p
                                        id="signup-confirm-password-error"
                                        className="field-message"
                                    >
                                        {formErrors.confirmPassword}
                                    </p>
                                ) : null}
                            </label>
                        </CardContent>

                        <CardFooter className="flex-col items-stretch border-t-0 bg-transparent">
                            <button
                                type="submit"
                                className="primary-button auth-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '作成中...' : 'サインアップ'}
                            </button>

                            <p className="auth-footnote">
                                すでにアカウントをお持ちの場合は
                                <Link to="/signin" className="auth-back-link">
                                    こちら
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </section>
    );
}

function isEmailAlreadyInUseError(error: unknown): boolean {
    return (
        error instanceof ApiError &&
        error.statusCode === 409 &&
        error.messages.includes('Email is already in use')
    );
}
