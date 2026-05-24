import type { InterestOption, Lesson, TypingQuestion } from '../types/domain'

export const interests: InterestOption[] = [
    { id: 'interest-kpop', label: 'K-POP' },
    { id: 'interest-drama', label: 'ドラマ' },
    { id: 'interest-travel', label: '旅行' },
    { id: 'interest-daily', label: '日常' },
]

export const lessons: Lesson[] = [
    {
        id: 'lesson-1',
        levelLabel: 'Lv.1',
        title: '単語編',
        theme: 'K-POP',
        progress: 82,
        locked: false,
    },
    {
        id: 'lesson-2',
        levelLabel: 'Lv.2',
        title: '短文編',
        theme: 'K-POP',
        progress: 0,
        locked: false,
    },
    {
        id: 'lesson-3',
        levelLabel: 'Lv.3',
        title: '分かち書き',
        theme: '旅行',
        progress: 0,
        locked: true,
    },
]

export const typingQuestions: TypingQuestion[] = [
    {
        id: 'question-1',
        koreanText: '뉴진스 노래를 들어요',
        japaneseText: 'NewJeansの歌を聴きます。',
    },
    {
        id: 'question-2',
        koreanText: '오늘 카페에 가요',
        japaneseText: '今日はカフェに行きます。',
    },
    {
        id: 'question-3',
        koreanText: '이 드라마가 좋아요',
        japaneseText: 'このドラマが好きです。',
    },
]

export const learnedWords = [
    { korean: '노래', meaningJa: '歌' },
    { korean: '듣다', meaningJa: '聴く' },
    { korean: '좋아요', meaningJa: '好きです' },
]
