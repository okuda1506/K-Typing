import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from './authApi';
import { saveAuthSession } from './authSession';

type SignInForm = {
    email: string;
    password: string;
};

const initialForm: SignInForm = {
    email: '',
    password: '',
};

export function SignInPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(field: keyof SignInForm, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        if (errorMessage) {
            setErrorMessage('');
        }
    }

    function validateForm() {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            return 'メールアドレスの形式を確認してください';
        }

        if (!form.password) {
            return 'パスワードを入力してください';
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
            const response = await signIn({
                email: form.email,
                password: form.password,
            });

            saveAuthSession(response);

            navigate('/', { replace: true }); // replace: trueで遷移元を履歴から置き換える
        } catch {
            setErrorMessage('メールアドレスまたはパスワードが正しくありません');
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
                    <p className="eyebrow">Sign in</p>
                    <h1 className="auth-title">
                        <span>다시 이어서</span>
                        <span>정확하게</span>
                    </h1>
                    <p>今日も、韓国語を正確に打つ。</p>
                </header>

                <form className="auth-form reveal-delay-1" onSubmit={handleSubmit} data-reveal>
                    <div className="section-title">
                        <h2>サインイン</h2>
                    </div>

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
                            autoComplete="current-password"
                            placeholder="パスワード"
                        />
                    </label>

                    <button type="submit" className="primary-button auth-submit" disabled={isSubmitting}>
                        {isSubmitting ? '確認中...' : 'サインイン'}
                    </button>

                    <p className="auth-footnote">
                        アカウントをお持ちでない場合は
                        <Link to="/signup" className="auth-back-link">
                            こちら
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
