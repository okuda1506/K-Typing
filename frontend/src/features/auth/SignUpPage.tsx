import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type SignUpForm = {
    displayName: string
    email: string
    password: string
    passwordConfirmation: string
}

const initialForm: SignUpForm = {
    displayName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
}

export function SignUpPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState(initialForm)
    const [errorMessage, setErrorMessage] = useState('')

    function updateField(field: keyof SignUpForm, value: string) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))

        if (errorMessage) {
            setErrorMessage('')
        }
    }

    function validateForm() {
        if (!form.displayName.trim()) {
            return '名前を入力してください'
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            return 'メールアドレスの形式を確認してください'
        }

        if (form.password.length < 8) {
            return 'パスワードは8文字以上で入力してください'
        }

        if (form.password !== form.passwordConfirmation) {
            return '確認用パスワードが一致していません'
        }

        return ''
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const validationMessage = validateForm()

        if (validationMessage) {
            setErrorMessage(validationMessage)
            return
        }

        navigate('/onboarding')
    }

    return (
        <section className="page-card signup-page">
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
                            value={form.passwordConfirmation}
                            onChange={(event) =>
                                updateField('passwordConfirmation', event.target.value)
                            }
                            type="password"
                            autoComplete="new-password"
                            placeholder="もう一度入力"
                        />
                    </label>

                    {errorMessage ? (
                        <p className="form-message" role="alert">
                            {errorMessage}
                        </p>
                    ) : null}

                    <button type="submit" className="primary-button auth-submit">
                        アカウントを作成
                    </button>

                    <p className="auth-footnote">
                        すでにアカウントをお持ちの場合は
                        <Link to="/" className="auth-back-link">
                            こちら
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    )
}
