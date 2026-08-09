import { Controller, Get } from '@nestjs/common';

import { OnboardingService } from './onboarding.service';
import { OnboardingOptionsResponse } from './types/onboarding-options-response.type';

@Controller('onboarding')
export class OnboardingController {
    constructor(private readonly onboardingService: OnboardingService) {}

    @Get('options')
    getOptions(): Promise<OnboardingOptionsResponse> {
        return this.onboardingService.getOptions();
    }
}
