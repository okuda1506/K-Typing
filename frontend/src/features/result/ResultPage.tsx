import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { learnedWords } from '../../mock/mockData'

type ResultLocationState = {
    accuracy?: number
    mistakeCount?: number
}

export function ResultPage() {
    const location = useLocation()
    const state = location.state as ResultLocationState | null
    const accuracy = Math.round(state?.accuracy ?? 92)
    const mistakeCount = state?.mistakeCount ?? 3
    const scoreStyle = { '--score': `${accuracy}%` } as CSSProperties

    return (
        <section className="page-card result-page">
            <header className="result-hero" data-reveal>
                <p className="eyebrow">Session clear</p>
                <h1>Lv.1 単語編クリア</h1>
                <p>今日の入力結果をまとめました。</p>
            </header>

            <div className="result-score-panel reveal-delay-1" data-reveal>
                <div className="score-ring" style={scoreStyle} aria-label={`正確率 ${accuracy}%`}>
                    <div className="score-value">
                        <strong>{accuracy}</strong>
                        <span>%</span>
                    </div>
                </div>

                <div className="result-metrics">
                    <div className="metric-row">
                        <span>正確率</span>
                        <strong>{accuracy}%</strong>
                    </div>
                    <div className="metric-row">
                        <span>ミス</span>
                        <strong>{mistakeCount}回</strong>
                    </div>
                    <div className="metric-row">
                        <span>評価</span>
                        <strong>初級上位</strong>
                    </div>
                </div>
            </div>

            <section className="word-list reveal-delay-2" data-reveal>
                <div className="word-list-header">
                    <h2>今日の単語</h2>
                    <span>{learnedWords.length} words</span>
                </div>
                {learnedWords.map((word) => (
                    <div key={word.korean} className="word-row" data-reveal>
                        <strong>{word.korean}</strong>
                        <span>{word.meaningJa}</span>
                    </div>
                ))}
            </section>

            <div className="result-actions reveal-delay-3" data-reveal>
                <Link to="/lessons/lesson-2/typing" className="primary-button link-button">
                    次のレッスンへ
                </Link>
                <Link to="/" className="secondary-link">
                    ホームへ戻る
                </Link>
            </div>
        </section>
    )
}
