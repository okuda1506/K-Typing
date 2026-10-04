export type InterestOption = {
    id: string;
    key: string;
    labelJa: string;
    detailQuestionJa: string;
    detailPlaceholderJa: string;
};

export type OnboardingOptionsResponse = {
    interests: InterestOption[];
    maxSelections: number;
};

export type PreferenceAnswerErrors = Record<string, string>;

export type SaveOnboardingInterestsRequest = {
    interests: {
        interestId: string;
        detailAnswer: string;
    }[];
};

export type SaveOnboardingInterestsResponse = {
    interests: {
        interestId: string;
        detailAnswer: string;
    }[];
};
