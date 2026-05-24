import { useNavigate } from 'react-router-dom'
import { lessons } from '../../mock/mockData'

export function HomePage() {
    const navigate = useNavigate()
    const recommendedLesson = lessons.find((lesson) => !lesson.locked)

    function startLesson(lessonId: string) {
        navigate(`/lessons/${lessonId}/typing`)
    }

    return (
        <section className="page-card">
            <header className="page-header compact" data-reveal>
                <p className="eyebrow">오늘의 학습</p>
                <h1>ロードマップ</h1>
            </header>

            {recommendedLesson ? (
                <button
                    type="button"
                    className="recommendation reveal-delay-1"
                    onClick={() => startLesson(recommendedLesson.id)}
                    data-reveal
                >
                    <span>今日のおすすめ</span>
                    <strong>
                        {recommendedLesson.levelLabel} {recommendedLesson.title}
                    </strong>
                </button>
            ) : null}

            <div className="lesson-list reveal-delay-2" aria-label="レッスン一覧" data-reveal>
                {lessons.map((lesson, index) => (
                    <button
                        key={lesson.id}
                        type="button"
                        className={`lesson-row reveal-delay-${Math.min(index + 1, 3)}`}
                        disabled={lesson.locked}
                        onClick={() => startLesson(lesson.id)}
                        data-reveal
                    >
                        <span>
                            <strong>
                                {lesson.levelLabel} {lesson.title}
                            </strong>
                            <small>テーマ: {lesson.theme}</small>
                        </span>
                        <small>
                            {lesson.locked ? 'LOCK' : lesson.progress > 0 ? `${lesson.progress}%` : 'NEXT'}
                        </small>
                    </button>
                ))}
            </div>
        </section>
    )
}
