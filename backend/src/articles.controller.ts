import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';

// クエリパラメー手用のDTO
export class ArticleQueryDto {
    page?: number;
    limit?: number;
    category?: string;
    author?: string;
    published?: boolean;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

@Controller('articles')
export class ArticlesController {
    @Get()
    findAll(@Query() query: ArticleQueryDto): object {
        // デフォルト値の設定
        const {
            page = 1,
            limit = 10,
            category = 'testCategory',
            author,
            published,
            sortBy = 'createdAt',
            order = 'desc',
        } = query;

        return {
            filters: { category, author, published },
            pagination: { page, limit, sortBy, order },
            message: 'フィルタリングされた記事一覧を取得',
        };
    }
}
