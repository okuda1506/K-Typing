import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { interests } from '../../mock/mockData'

const maxInterests = 3

export function OnboardingPage() {
    const navigate = useNavigate()
    const [selectedIds, setSelectedIds] = useState<string[]>([
        'interest-kpop',
        'interest-travel',
    ])
    const [favoritePerson, setFavoritePerson] = useState('NewJeans')

    const helperText = useMemo(() => {
        if (selectedIds.length === 0) {
            return '少なくとも1つ選択してください'
        }

        return `${selectedIds.length}/${maxInterests} 選択中`
    }, [selectedIds.length])

    function toggleInterest(id: string) {
        setSelectedIds((current) => {
            if (current.includes(id)) {
                return current.filter((selectedId) => selectedId !== id)
            }

            if (current.length >= maxInterests) {
                return current
            }

            return [...current, id]
        })
    }

    function handleSubmit() {
        if (selectedIds.length === 0) {
            return
        }

        navigate('/')
    }

    return (
        <section className="page-card onboarding-page">
            <header className="page-header" data-reveal>
                <p className="eyebrow">First setup</p>
                <h1>あなた専用の韓国語レッスンを作ります</h1>
                <p>
                    好きなテーマを選ぶと、例文や単語があなた向けになります。
                </p>
            </header>

            <div className="form-section reveal-delay-1" data-reveal>
                <div className="section-title">
                    <h2>興味</h2>
                    <span>{helperText}</span>
                </div>
                <div className="chip-list" aria-label="興味選択">
                    {interests.map((interest) => {
                        const selected = selectedIds.includes(interest.id)

                        return (
                            <button
                                key={interest.id}
                                type="button"
                                className={selected ? 'chip selected' : 'chip'}
                                onClick={() => toggleInterest(interest.id)}
                            >
                                {interest.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <label className="field reveal-delay-2" data-reveal>
                <span>好きなアーティストや俳優</span>
                <input
                    value={favoritePerson}
                    onChange={(event) => setFavoritePerson(event.target.value)}
                    placeholder="例: NewJeans"
                />
            </label>

            <button
                type="button"
                className="primary-button reveal-delay-3"
                onClick={handleSubmit}
                data-reveal
            >
                学習を始める
            </button>
        </section>
    )
}
