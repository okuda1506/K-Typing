export type CharState = 'correct' | 'wrong' | 'pending' | 'extra'

export type JudgedChar = {
    char: string
    state: CharState
}

export type MistakeSummary = {
    count: number
    firstWrongChar: string | null
}

export function normalizeKoreanInput(value: string): string {
    return value.normalize('NFC').replace(/\r?\n/g, '')
}

export function judgeTyping(expected: string, actual: string): JudgedChar[] {
    const expectedChars = Array.from(normalizeKoreanInput(expected))
    const actualChars = Array.from(normalizeKoreanInput(actual))
    const maxLength = Math.max(expectedChars.length, actualChars.length)

    return Array.from({ length: maxLength }, (_, index) => {
        const expectedChar = expectedChars[index]
        const actualChar = actualChars[index]

        if (expectedChar === undefined && actualChar !== undefined) {
            return { char: actualChar, state: 'extra' }
        }

        if (actualChar === undefined) {
            return { char: expectedChar ?? '', state: 'pending' }
        }

        return {
            char: expectedChar,
            state: expectedChar === actualChar ? 'correct' : 'wrong',
        }
    })
}

export function summarizeMistakes(chars: JudgedChar[]): MistakeSummary {
    const wrongChars = chars.filter((char) => char.state === 'wrong' || char.state === 'extra')

    return {
        count: wrongChars.length,
        firstWrongChar: wrongChars[0]?.char ?? null,
    }
}

export function calculateAccuracy(chars: JudgedChar[]): number {
    const judgedChars = chars.filter((char) => char.state !== 'pending')

    if (judgedChars.length === 0) {
        return 0
    }

    const correctCount = judgedChars.filter((char) => char.state === 'correct').length

    return Math.round((correctCount / judgedChars.length) * 100)
}
