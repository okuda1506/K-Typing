import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getOnboardingOptions } from './onboardingApi';

import type {
    OnboardingOptionsResponse,
    PreferenceAnswerErrors,
} from './types';

export function OnboardingPage() {
    const navigate = useNavigate();
    const [options, setOptions] = useState<OnboardingOptionsResponse | null>(
        null,
    );
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [preferenceAnswers, setPreferenceAnswers] = useState<
        Record<string, string>
    >({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [preferenceErrors, setPreferenceErrors] =
        useState<PreferenceAnswerErrors>({});
    const interests = options?.interests ?? [];
    const maxInterests = options?.maxSelections ?? 0;
    const helperText =
        selectedIds.length === 0
            ? '少なくとも1つ選択してください'
            : `${selectedIds.length}/${maxInterests} 選択中`;

    useEffect(() => {
        let isCancelled = false;

        async function loadOptions() {
            try {
                const response = await getOnboardingOptions();

                if (!isCancelled) {
                    setOptions(response);
                }
            } catch {
                if (!isCancelled) {
                    setLoadError('興味の取得に失敗しました');
                    toast.error('興味の取得に失敗しました');
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadOptions();

        return () => {
            isCancelled = true;
        };
    }, []);

    function toggleInterest(id: string) {
        if (selectedIds.includes(id)) {
            clearPreferenceError(id);
        }

        setSelectedIds((current) => {
            if (current.includes(id)) {
                return current.filter((selectedId) => selectedId !== id);
            }

            if (current.length >= maxInterests) {
                return current;
            }

            return [...current, id];
        });
    }

    function updatePreferenceAnswer(interestId: string, value: string) {
        setPreferenceAnswers((current) => ({
            ...current,
            [interestId]: value,
        }));

        clearPreferenceError(interestId);
    }

    function handleSubmit() {
        if (selectedIds.length === 0) {
            return;
        }

        const validationErrors = validatePreferenceAnswers();

        if (Object.keys(validationErrors).length > 0) {
            setPreferenceErrors(validationErrors);
            return;
        }

        setPreferenceErrors({});
        navigate('/');
    }

    function clearPreferenceError(interestId: string) {
        setPreferenceErrors((currentErrors) => {
            if (!currentErrors[interestId]) {
                return currentErrors;
            }

            const nextErrors = { ...currentErrors };
            delete nextErrors[interestId];

            return nextErrors;
        });
    }

    function validatePreferenceAnswers(): PreferenceAnswerErrors {
        const errors: PreferenceAnswerErrors = {};

        for (const interestId of selectedIds) {
            if (!preferenceAnswers[interestId]?.trim()) {
                errors[interestId] = '興味の詳細を入力してください';
            }
        }

        return errors;
    }

    return (
        <section className="page-card onboarding-page">
            <header className="page-header" data-reveal>
                <p className="eyebrow">First setup</p>
                <h1>あなた専用の韓国語レッスンを作ります</h1>
                <p>好きなテーマを選ぶと例文や単語があなた向けになります。</p>
            </header>

            <div className="form-section reveal-delay-1" data-reveal>
                <div className="section-title">
                    <h2>興味</h2>
                    {!isLoading && !loadError ? (
                        <span>{helperText}</span>
                    ) : null}
                </div>

                {isLoading ? (
                    <p role="status">興味を読み込んでいます...</p>
                ) : loadError ? (
                    <p className="form-message" role="alert">
                        {loadError}
                    </p>
                ) : (
                    <div className="chip-list" aria-label="興味選択">
                        {interests.map((interest) => {
                            const selected = selectedIds.includes(interest.id);

                            return (
                                <button
                                    key={interest.id}
                                    type="button"
                                    className={
                                        selected ? 'chip selected' : 'chip'
                                    }
                                    aria-pressed={selected}
                                    onClick={() => toggleInterest(interest.id)}
                                >
                                    {interest.labelJa}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedIds.length > 0 ? (
                <div className="form-section question-transition">
                    <div className="section-title">
                        <h2>興味の詳細</h2>
                        <span>必須</span>
                    </div>

                    {interests
                        .filter((interest) => selectedIds.includes(interest.id))
                        .map((interest) => {
                            const errorMessage = preferenceErrors[interest.id];
                            const errorId = `interest-${interest.id}-error`;

                            return (
                                <label className="field" key={interest.id}>
                                    <span>{interest.detailQuestionJa}</span>
                                    <input
                                        value={
                                            preferenceAnswers[interest.id] ?? ''
                                        }
                                        onChange={(event) =>
                                            updatePreferenceAnswer(
                                                interest.id,
                                                event.target.value,
                                            )
                                        }
                                        placeholder={
                                            interest.detailPlaceholderJa
                                        }
                                        aria-invalid={Boolean(errorMessage)}
                                        aria-describedby={
                                            errorMessage ? errorId : undefined
                                        }
                                    />
                                    {errorMessage ? (
                                        <p
                                            id={errorId}
                                            className="field-message"
                                        >
                                            {errorMessage}
                                        </p>
                                    ) : null}
                                </label>
                            );
                        })}
                </div>
            ) : null}

            <button
                type="button"
                className="primary-button reveal-delay-3"
                onClick={handleSubmit}
                disabled={
                    isLoading || Boolean(loadError) || selectedIds.length === 0
                }
                data-reveal
            >
                学習を始める
            </button>
        </section>
    );
}
