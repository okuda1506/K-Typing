export type InterestOption = {
  id: string
  label: string
}

export type Lesson = {
  id: string
  levelLabel: string
  title: string
  theme: string
  progress: number
  locked: boolean
}

export type TypingQuestion = {
  id: string
  koreanText: string
  japaneseText: string
}

export type LearnedWord = {
  korean: string
  meaningJa: string
}
