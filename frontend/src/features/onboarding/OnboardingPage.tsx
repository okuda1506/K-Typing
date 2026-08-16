import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getOnboardingOptions } from './onboardingApi';

import type { OnboardingOptionsResponse } from './types';

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
    }

    function handleSubmit() {
        if (selectedIds.length === 0) {
            return;
        }

        navigate('/');
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
                        <span>任意</span>
                    </div>

                    {interests
                        .filter((interest) => selectedIds.includes(interest.id))
                        .map((interest) => (
                            <label className="field" key={interest.id}>
                                <span>{interest.detailQuestionJa}</span>
                                <input
                                    value={preferenceAnswers[interest.id] ?? ''}
                                    onChange={(event) =>
                                        updatePreferenceAnswer(
                                            interest.id,
                                            event.target.value,
                                        )
                                    }
                                    placeholder={interest.detailPlaceholderJa}
                                />
                            </label>
                        ))}
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
