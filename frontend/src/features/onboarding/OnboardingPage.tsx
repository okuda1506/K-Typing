import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interests } from '../../mock/mockData';

const maxInterests = 3;

type PreferenceQuestion = {
    label: string;
    placeholder: string;
};

const preferenceQuestions: Record<string, PreferenceQuestion> = {
    'interest-kpop': {
        label: '好きなアーティスト・グループ',
        placeholder: '例: NewJeans、BTS',
    },
    'interest-drama': {
        label: '好きなドラマ・俳優',
        placeholder: '例: 涙の女王、キム・スヒョン',
    },
    'interest-travel': {
        label: '行ってみたい韓国の場所',
        placeholder: '例: ソウル、釜山',
    },
    'interest-food': {
        label: '好きな韓国料理・食べてみたい料理',
        placeholder: '例: サムギョプサル、トッポッキ',
    },
    'interest-beauty-fashion': {
        label: '興味のあるブランド・アイテム',
        placeholder: '例: 韓国コスメ、ストリートファッション',
    },
    'interest-daily': {
        label: '学習したい日常の場面',
        placeholder: '例: カフェ、買い物',
    },
};

export function OnboardingPage() {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([
        'interest-kpop',
        'interest-travel',
    ]);
    const [preferenceAnswers, setPreferenceAnswers] = useState<
        Record<string, string>
    >({
        'interest-kpop': 'NewJeans',
    });

    const helperText = useMemo(() => {
        if (selectedIds.length === 0) {
            return '少なくとも1つ選択してください';
        }

        return `${selectedIds.length}/${maxInterests} 選択中`;
    }, [selectedIds.length]);

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
                    <span>{helperText}</span>
                </div>
                <div className="chip-list" aria-label="興味選択">
                    {interests.map((interest) => {
                        const selected = selectedIds.includes(interest.id);

                        return (
                            <button
                                key={interest.id}
                                type="button"
                                className={selected ? 'chip selected' : 'chip'}
                                onClick={() => toggleInterest(interest.id)}
                            >
                                {interest.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedIds.length > 0 ? (
                <div className="form-section question-transition">
                    <div className="section-title">
                        <h2>興味の詳細</h2>
                        <span>任意</span>
                    </div>

                    {interests
                        .filter((interest) => selectedIds.includes(interest.id))
                        .map((interest) => {
                            const question = preferenceQuestions[interest.id];

                            if (!question) {
                                return null;
                            }

                            return (
                                <label className="field" key={interest.id}>
                                    <span>{question.label}</span>
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
                                        placeholder={question.placeholder}
                                    />
                                </label>
                            );
                        })}
                </div>
            ) : null}

            <button
                type="button"
                className="primary-button reveal-delay-3"
                onClick={handleSubmit}
                data-reveal
            >
                学習を始める
            </button>
        </section>
    );
}
