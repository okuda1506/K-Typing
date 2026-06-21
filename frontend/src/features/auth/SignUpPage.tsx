import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from './authApi';
import { saveAuthSession } from './authSession';

type SignUpForm = {
    displayName: string
    email: string
    password: string
    confirmPassword: string
};

const initialForm: SignUpForm = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export function SignUpPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(field: keyof SignUpForm, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        if (errorMessage) {
            setErrorMessage('');
        }
    }

    function validateForm() {
        if (!form.displayName.trim()) {
            return '名前を入力してください';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            return 'メールアドレスの形式を確認してください';
        }

        if (form.password.length < 8) {
            return 'パスワードは8文字以上で入力してください';
        }

        if (form.password !== form.confirmPassword) {
            return '確認用パスワードが一致していません';
        }

        return '';
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setErrorMessage('');

        const validationError = validateForm();

        if (validationError) {
            setErrorMessage(validationError);
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

            navigate('/onboarding', { replace: true });
        } catch {
            setErrorMessage('アカウント作成に失敗しました');
            setIsSubmitting(false);
        }
    };

    return (
        <section className="page-card auth-page">
            {errorMessage ? (
                <div
                    className="auth-toast auth-toast-error"
                    role="alert"
                    aria-live="assertive"
                >
                    <span className="auth-toast-dot" aria-hidden="true" />
                    <span>{errorMessage}</span>
                </div>
            ) : null}

            <div className="auth-layout">
                <header className="page-header auth-copy" data-reveal>
                    <p className="eyebrow">Create account</p>
                    <h1 className="auth-title">
                        <span>한 글자씩</span>
                        <span>정확하게</span>
                    </h1>
                    <p>韓国語を、正確に打つ。</p>
                </header>

                <form className="auth-form reveal-delay-1" onSubmit={handleSubmit} data-reveal>
                    <div className="section-title">
                        <h2>サインアップ</h2>
                    </div>

                    <label className="field auth-field">
                        <span>名前</span>
                        <input
                            value={form.displayName}
                            onChange={(event) => updateField('displayName', event.target.value)}
                            type="text"
                            autoComplete="nickname"
                        />
                    </label>

                    <label className="field auth-field">
                        <span>メールアドレス</span>
                        <input
                            value={form.email}
                            onChange={(event) => updateField('email', event.target.value)}
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="field auth-field">
                        <span>パスワード</span>
                        <input
                            value={form.password}
                            onChange={(event) => updateField('password', event.target.value)}
                            type="password"
                            autoComplete="new-password"
                            placeholder="8文字以上"
                        />
                    </label>

                    <label className="field auth-field">
                        <span>パスワード確認</span>
                        <input
                            value={form.confirmPassword}
                            onChange={(event) =>
                                updateField('confirmPassword', event.target.value)
                            }
                            type="password"
                            autoComplete="new-password"
                            placeholder="もう一度入力"
                        />
                    </label>

                    <button type="submit" className="primary-button auth-submit" disabled={isSubmitting}>
                        {isSubmitting ? '作成中...' : 'アカウントを作成'}
                    </button>

                    <p className="auth-footnote">
                        すでにアカウントをお持ちの場合は
                        <Link to="/signin" className="auth-back-link">
                            こちら
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    )
}
