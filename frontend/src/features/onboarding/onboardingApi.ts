import { apiFetch, authenticatedApiFetch } from '@/lib/apiClient';
import type {
    OnboardingOptionsResponse,
    SaveOnboardingInterestsRequest,
    SaveOnboardingInterestsResponse,
} from './types';

export function getOnboardingOptions(): Promise<OnboardingOptionsResponse> {
    return apiFetch<OnboardingOptionsResponse>('/onboarding/options');
}

export function saveOnboardingInterests(
    data: SaveOnboardingInterestsRequest,
): Promise<SaveOnboardingInterestsResponse> {
    return authenticatedApiFetch<SaveOnboardingInterestsResponse>(
        '/onboarding/interests',
        {
            method: 'PUT',
            body: JSON.stringify(data),
        },
    );
}
