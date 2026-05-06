import { Controller, Get, Post, Body, Param, Query, NotFoundException, BadRequestException } from '@nestjs/common';

@Controller('products')
export class ProductsController {
    private users = [{ id: 1, name: '田中太郎' }];

    // @Get()
    // findProducts(
    //     @Query('category') category: string,
    //     @Query('limit') limit: string,
    //     @Query('offset') offset: string,
    // ): object {
    //     return {
    //         category,
    //         limit: +limit || 10,
    //         offset: +offset || 0,
    //         products: [],
    //     };
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string): object {
    //     const productId = parseInt(id, 10);

    //     if (isNaN(productId)) {
    //         throw new BadRequestException('無効な商品IDです');
    //     }

    //     return { id: productId, name: `商品 ${productId}` };
    // }

    @Get('category/:categoryId/product/:productId')
    getProductInCategory(
        @Param() params: { categoryId: string; productId: string },
    ): object {
        return {
            categoryId: +params.categoryId,
            productId: +params.productId,
            message: `カテゴリ ${params.categoryId} の商品 ${params.productId}`,
        };
    }

    @Get('search')
    searchProducts(
        @Query('keyword') keyword: string,
        @Query('category') category: string,
        @Query('limit') limit: string,
    ): object {
        return {
            keyword,
            category,
            limit: limit ? +limit : 10,
            message: '商品検索を実行',
        };
    }
}
