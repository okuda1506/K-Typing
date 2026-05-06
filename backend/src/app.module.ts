import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './users.controller';
import { ApiController } from './api.controller';
import { ProductsController } from './products.controller';
import { OrderController } from './orders.controller';
import { AppService } from './app.service';

@Module({
    imports: [],
    controllers: [
        AppController,
        UserController,
        ApiController,
        ProductsController,
        OrderController,
    ],
    providers: [AppService],
})
export class AppModule {}
