import {
    IsNotEmpty,
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    name!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    displayName!: string;

    @IsEmail()
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password!: string;
}
