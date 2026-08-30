import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { OnboardingService } from './onboarding.service';
import { SaveOnboardingInterestsDto } from './dto/save-onboarding-interests.dto';
import { OnboardingOptionsResponse } from './types/onboarding-options-response.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SaveOnboardingInterestsResponse } from './types/save-onboarding-interests-response.type';
import { AuthUser } from '../auth/types/auth-user.type';

@Controller('onboarding')
export class OnboardingController {
    constructor(private readonly onboardingService: OnboardingService) {}

    /**
     * 有効な興味選択肢と選択上限を取得する
     *
     * @returns オンボーディング選択肢
     */
    @Get('options')
    getOptions(): Promise<OnboardingOptionsResponse> {
        return this.onboardingService.getOptions();
    }

    /**
     * ログインユーザーの興味設定を保存する
     *
     * @param request JWT認証済みユーザーを含むリクエスト
     * @param dto 選択した興味IDと詳細回答
     * @returns 保存した興味設定
     * @throws JWT認証に失敗または不正な興味が含まれる場合
     */
    @Put('interests')
    @UseGuards(JwtAuthGuard)
    saveInterests(
        @Req() request: Request & { user: AuthUser },
        @Body() dto: SaveOnboardingInterestsDto,
    ): Promise<SaveOnboardingInterestsResponse> {
        return this.onboardingService.saveInterests(request.user.id, dto);
    }
}
