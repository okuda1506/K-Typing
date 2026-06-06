import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    displayName!: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(72)
    password!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(72)
    confirmPassword!: string;
}
