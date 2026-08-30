import { IsString, IsUUID, Matches, MaxLength } from 'class-validator';
import { MAX_DETAIL_ANSWER_LENGTH } from '../constants/onboarding.constants';

export class OnboardingInterestDto {
    @IsUUID()
    interestId!: string;

    @IsString()
    @Matches(/\S/)
    @MaxLength(MAX_DETAIL_ANSWER_LENGTH)
    detailAnswer!: string;
}
