export type SavedOnboardingInterest = {
    interestId: string;
    detailAnswer: string;
};

export type SaveOnboardingInterestsResponse = {
    interests: SavedOnboardingInterest[];
};
