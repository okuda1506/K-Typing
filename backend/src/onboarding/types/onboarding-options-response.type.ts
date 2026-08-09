import { InterestOption } from './interest-option.type';

export type OnboardingOptionsResponse = {
    interests: InterestOption[];
    maxSelections: number;
};
