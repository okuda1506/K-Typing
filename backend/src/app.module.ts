import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { UserController } from './users/users.controller';
import { ApiController } from './api.controller';
import { ProductsController } from './products.controller';
import { OrderController } from './orders.controller';
import { ArticlesController } from './articles.controller';
import { BlogsController } from './blogs.controller';
import { FilesController } from './files.controller';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    controllers: [
        AppController,
        UserController,
        ApiController,
        ProductsController,
        OrderController,
        ArticlesController,
        BlogsController,
        FilesController,
        EventsController,
    ],
    providers: [AppService, UsersService],
})
export class AppModule {}
