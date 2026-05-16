import {
    Controller,
    Get,
    Param,
    Post,
    Put,
    Body,
    Delete,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.userService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }
}
