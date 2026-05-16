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

interface BlogPost {
    id: number;
    title: string;
    content: string;
    authorId: number;
    category: string;
    published: boolean;
    createdAt: Date;
}

@Controller('blogs')
export class BlogsController {
    private posts: BlogPost[] = [
        {
            id: 1,
            title: 'NestJS入門',
            content: 'NestJSの基本について...',
            authorId: 1,
            category: 'programming',
            published: true,
            createdAt: new Date('2026-05-01'),
        },
        {
            id: 2,
            title: 'TypeScriptの利点',
            content: 'TypeScriptのメリットについて...',
            authorId: 2,
            category: 'programming',
            published: false,
            createdAt: new Date('2026-05-07'),
        },
    ];

    @Get()
    findAll(
        @Query('category') category?: string,
        @Query('authorId') authorId?: string,
        @Query('published') published?: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ): object {
        let filteredPosts = this.posts;

        // フィルタリング
        if (category) {
            filteredPosts = filteredPosts.filter(
                (post) => post.category === category,
            );
        }
        if (authorId) {
            filteredPosts = filteredPosts.filter(
                (post) => post.authorId === +authorId,
            );
        }
        if (published !== undefined) {
            const isPublished = published === 'true';
            filteredPosts = filteredPosts.filter(
                (post) => post.published === isPublished,
            );
        }

        // ページネーション
        const pageNum = +page;
        const limitNum = +limit;
        const offset = (pageNum - 1) * limitNum;
        const paginatedPosts = filteredPosts.slice(offset, offset + limitNum);

        return {
            posts: paginatedPosts,
            total: filteredPosts.length,
            page: pageNum,
            limit: limitNum,
            filters: { category, authorId, published },
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string): BlogPost {
        const postId = +id;
        const post = this.posts.find((p) => p.id === postId);

        if (!post) {
            throw new NotFoundException('記事が見つかりません');
        }

        return post;
    }

    @Get('author/:authorId/posts')
    getPostsByAuthor(
        @Param('authorId') authorId: string,
        @Query('published') published?: string,
    ): BlogPost[] {
        const authorIdNum = +authorId;
        let authorPosts = this.posts.filter(
            (post) => post.authorId === authorIdNum,
        );

        if (published !== undefined) {
            const isPublished = published === 'true';
            authorPosts = authorPosts.filter(
                (post) => post.published === isPublished,
            );
        }

        return authorPosts;
    }
}
