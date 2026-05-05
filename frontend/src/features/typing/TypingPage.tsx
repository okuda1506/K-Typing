import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { typingQuestions } from '../../mock/mockData'
import {
  calculateAccuracy,
  judgeTyping,
  normalizeKoreanInput,
  summarizeMistakes,
} from './typingJudge'

type AnswerState = 'idle' | 'correct' | 'wrong'
const NEXT_QUESTION_DELAY_MS = 900
const FINAL_ANSWER_FEEDBACK_DELAY_MS = 650
const RESULT_LOADING_DELAY_MS = 2000
const COUNTDOWN_STEP_DELAY_MS = 720

export function TypingPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputText, setInputText] = useState('')
  const [accuracies, setAccuracies] = useState<number[]>([])
  const [mistakeCounts, setMistakeCounts] = useState<number[]>([])
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [isResultLoading, setIsResultLoading] = useState(false)
  const [countdownValue, setCountdownValue] = useState<number | null>(3)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const nextTimerRef = useRef<number | null>(null)
  const resultTimerRef = useRef<number | null>(null)
  const countdownTimersRef = useRef<number[]>([])

  const currentQuestion = typingQuestions[currentIndex] ?? typingQuestions[0]
  const judgedChars = useMemo(
    () => judgeTyping(currentQuestion.koreanText, inputText),
    [currentQuestion.koreanText, inputText],
  )
  const mistakeSummary = useMemo(() => summarizeMistakes(judgedChars), [judgedChars])
  const currentAccuracy = calculateAccuracy(judgedChars)
  const progress = ((currentIndex + 1) / typingQuestions.length) * 100
  const isCountingDown = countdownValue !== null
  const isAnswering = isCountingDown || answerState !== 'idle' || isResultLoading
  const isLastQuestion = currentIndex >= typingQuestions.length - 1
  const questionAnimationKey = currentQuestion.id
  const hasInput = normalizeKoreanInput(inputText).length > 0
  const correctTypedCount = judgedChars.filter((char) => char.state === 'correct').length
  const shouldShowStatus = answerState === 'idle' && hasInput && correctTypedCount > 0
  const statusText =
    mistakeSummary.count === 0
      ? 'ここまで正しく入力できています'
      : `${mistakeSummary.count}文字だけ違います`
  const statusValue = mistakeSummary.firstWrongChar ?? `${currentAccuracy}%`
  const statusTone = mistakeSummary.count === 0 ? 'success' : 'warning'
  const answerMessage =
    answerState === 'correct'
      ? 'その調子です！'
      : '後で復習しましょう'
  const answerButtonLabel = isCountingDown
    ? '準備中'
    : isAnswering
      ? isLastQuestion
        ? '集計中'
        : '次の問題へ'
      : '回答する'

  useEffect(() => {
    countdownTimersRef.current = [
      window.setTimeout(() => setCountdownValue(2), COUNTDOWN_STEP_DELAY_MS),
      window.setTimeout(() => setCountdownValue(1), COUNTDOWN_STEP_DELAY_MS * 2),
      window.setTimeout(() => setCountdownValue(null), COUNTDOWN_STEP_DELAY_MS * 3),
    ]

    return () => {
      countdownTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      if (nextTimerRef.current !== null) {
        window.clearTimeout(nextTimerRef.current)
      }
      if (resultTimerRef.current !== null) {
        window.clearTimeout(resultTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isCountingDown) {
      inputRef.current?.focus()
    }
  }, [isCountingDown])

  function advanceQuestion(nextAccuracies: number[], nextMistakeCounts: number[]) {
    if (isLastQuestion) {
      nextTimerRef.current = window.setTimeout(() => {
        setIsResultLoading(true)
        resultTimerRef.current = window.setTimeout(() => {
          navigate('/sessions/mock-session/result', {
            state: {
              lessonId,
              accuracy:
                nextAccuracies.reduce((total, accuracy) => total + accuracy, 0) /
                nextAccuracies.length,
              mistakeCount: nextMistakeCounts.reduce((total, count) => total + count, 0),
            },
          })
        }, RESULT_LOADING_DELAY_MS)
      }, FINAL_ANSWER_FEEDBACK_DELAY_MS)
      return
    }

    nextTimerRef.current = window.setTimeout(() => {
      setAccuracies(nextAccuracies)
      setMistakeCounts(nextMistakeCounts)
      setCurrentIndex((index) => index + 1)
      setInputText('')
      setAnswerState('idle')
      nextTimerRef.current = null
    }, NEXT_QUESTION_DELAY_MS)
  }

  function submitAnswer() {
    if (isAnswering) {
      return
    }

    const nextAccuracies = [...accuracies, currentAccuracy]
    const nextMistakeCounts = [...mistakeCounts, mistakeSummary.count]
    const isCorrect =
      normalizeKoreanInput(inputText) === normalizeKoreanInput(currentQuestion.koreanText)

    setAnswerState(isCorrect ? 'correct' : 'wrong')
    advanceQuestion(nextAccuracies, nextMistakeCounts)
  }

  return (
    <section className="page-card typing-page">
      <div className="typing-topbar" data-reveal>
        <button type="button" className="icon-button" onClick={() => navigate('/')}>
          ‹
        </button>
        <div className="progress-track" aria-label="問題進捗">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="typing-count">
          {currentIndex + 1} / {typingQuestions.length}
        </span>
      </div>

      <div
        key={`question-${questionAnimationKey}`}
        className="question-block question-transition reveal-delay-1"
        data-reveal
      >
        <div className="korean-text" aria-label="韓国語問題">
          {judgedChars.map((item, index) => (
            <span key={`${item.char}-${index}`} className={`char ${item.state}`}>
              {item.char === ' ' ? '·' : item.char}
            </span>
          ))}
        </div>
        <p className="translation">{currentQuestion.japaneseText}</p>
      </div>

      {shouldShowStatus ? (
        <div
          key={`status-${questionAnimationKey}`}
          className={`typing-status ${statusTone} question-transition question-transition-delay-1 reveal-delay-2`}
          data-reveal
        >
          <span>{statusText}</span>
          <strong>{statusValue}</strong>
        </div>
      ) : null}

      {isResultLoading ? (
        <div className="result-loading-screen" aria-live="polite" aria-busy="true">
          <div className="result-loading-inner">
            <span className="loading-spinner" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            <strong>結果を集計中...</strong>
            <p>今日のタイピング結果をまとめています</p>
          </div>
        </div>
      ) : answerState !== 'idle' ? (
        <div className={`answer-result ${answerState}`} aria-live="polite">
          <strong>{answerState === 'correct' ? '◯' : '×'}</strong>
          <span>{answerMessage}</span>
        </div>
      ) : null}

      {countdownValue !== null ? (
        <div className="countdown-screen" aria-live="polite" aria-label="開始カウントダウン">
          <strong key={countdownValue} className="countdown-number">
            {countdownValue}
          </strong>
        </div>
      ) : null}

      <label
        key={`input-${questionAnimationKey}`}
        className="field question-transition question-transition-delay-2 reveal-delay-3"
        data-reveal
      >
        <span>入力</span>
        <input
          ref={inputRef}
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          lang="ko"
          type="text"
          autoFocus
          disabled={isAnswering}
        />
      </label>

      <button
        type="button"
        className="primary-button push-bottom reveal-delay-3"
        onClick={submitAnswer}
        disabled={isAnswering}
        data-reveal
      >
        {answerButtonLabel}
      </button>
    </section>
  )
}
