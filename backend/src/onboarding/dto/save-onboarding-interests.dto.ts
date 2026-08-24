import {
    ArrayMaxSize,
    ArrayMinSize,
    ArrayUnique,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OnboardingInterestDto } from './onboarding-interest.dto';
import {
    MIN_INTEREST_SELECTIONS,
    MAX_INTEREST_SELECTIONS,
} from '../constants/onboarding.constants';

export class SaveOnboardingInterestsDto {
    @IsArray()
    @ArrayMinSize(MIN_INTEREST_SELECTIONS)
    @ArrayMaxSize(MAX_INTEREST_SELECTIONS)
    @ArrayUnique((item: OnboardingInterestDto) => item.interestId)
    @ValidateNested({ each: true })
    @Type(() => OnboardingInterestDto)
    interests!: OnboardingInterestDto[];
}
