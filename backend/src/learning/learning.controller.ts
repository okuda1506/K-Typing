import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { LearningService } from './learning.service';
import type { LearningOverviewResponse } from './types/learning-overview-response.type';

@Controller('learning')
export class LearningController {
    constructor(private readonly learningService: LearningService) {}

    /**
     * ログインユーザーの学習一覧を返す
     *
     * @param request 認証済みユーザーを含むリクエスト
     * @returns ジャンル別の学習構成・進捗
     */
    @Get('overview')
    @UseGuards(JwtAuthGuard)
    getOverview(
        @Req() request: Request & { user: AuthUser },
    ): Promise<LearningOverviewResponse> {
        return this.learningService.getOverview(request.user.id);
    }
}
