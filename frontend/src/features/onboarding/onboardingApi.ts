import { apiFetch } from '@/lib/apiClient';
import type { OnboardingOptionsResponse } from './types';

export function getOnboardingOptions(): Promise<OnboardingOptionsResponse> {
    return apiFetch<OnboardingOptionsResponse>('/onboarding/options');
}
