import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        // HTTP 関連の処理のみ
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const userId = +id;
        return this.usersService.findOne(userId);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
