import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

/** 学習構成とユーザー進捗の取得・整形を行う */
@Injectable()
export class LearningService {
    constructor(private readonly prisma: PrismaService) {}
}
