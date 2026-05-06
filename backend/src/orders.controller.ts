import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

@Controller('orders')
export class OrderController {
    @Get(':id')
    findOne(@Param('id') id: string): object {
        const orderId = +id;

        if (isNaN(orderId) || orderId <= 0) {
            throw new BadRequestException(
                '注文IDは正の整数である必要があります',
            );
        }

        if (orderId > 1000) {
            throw new BadRequestException('注文が見つかりません');
        }

        return { id: orderId, status: 'completed' };
    }
}
