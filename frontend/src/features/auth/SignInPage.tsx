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
import { signIn } from './authApi';
import type { SignInForm, SignInFormErrors } from './types';
import { saveAuthSession } from './authSession';
import { toast } from 'sonner';

const initialForm: SignInForm = {
    email: '',
    password: '',
};

export function SignInPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<SignInFormErrors>({});

    function updateField(field: keyof SignInForm, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setFormErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const next = { ...current };
            delete next[field];

            return next;
        });
    }

    function validateForm(): SignInFormErrors {
        const errors: SignInFormErrors = {};

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'メールアドレスの形式を確認してください';
        }

        if (!form.password) {
            errors.password = 'パスワードを入力してください';
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
            const response = await signIn({
                email: form.email,
                password: form.password,
            });

            saveAuthSession(response);

            toast.success('ログインしました');

            navigate('/', { replace: true }); // replace: trueで遷移元を履歴から置き換える
        } catch {
            toast.error('サインインに失敗しました');
            setIsSubmitting(false);
        }
    };

    return (
        <section className="page-card auth-page">
            <div className="auth-layout">
                <header className="page-header auth-copy" data-reveal>
                    <p className="eyebrow">Sign in</p>
                    <h1 className="auth-title">
                        <span>다시 이어서</span>
                        <span>정확하게</span>
                    </h1>
                    <p>今日も、韓国語を正確に打つ。</p>
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
                                サインイン
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="grid pt-1">
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
                                            ? 'signin-email-error'
                                            : undefined
                                    }
                                />
                                {formErrors.email ? (
                                    <p
                                        id="signin-email-error"
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
                                    autoComplete="current-password"
                                    placeholder="パスワード"
                                    aria-invalid={Boolean(formErrors.password)}
                                    aria-describedby={
                                        formErrors.password
                                            ? 'signin-password-error'
                                            : undefined
                                    }
                                />
                                {formErrors.password ? (
                                    <p
                                        id="signin-password-error"
                                        className="field-message"
                                    >
                                        {formErrors.password}
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
                                {isSubmitting ? '確認中...' : 'サインイン'}
                            </button>

                            <p className="auth-footnote">
                                アカウントをお持ちでない場合は
                                <Link to="/signup" className="auth-back-link">
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
