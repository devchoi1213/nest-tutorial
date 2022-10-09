import {IsString, MinLength, MaxLength, IsEmail, Matches} from 'class-validator';
import {Transform} from "class-transformer";
import {BadRequestException} from "@nestjs/common";

export class CreateUserDto {
    @Transform(({ value, obj }) => {
        if (obj.password.includes(value.trim())) {
            throw new BadRequestException('password는 name과 같은 문자열을 포함할 수 없습니다.');
        }
        return value.trim();
    })
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name: string;

    @IsEmail()
    @MaxLength(60)
    email: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    password: string;
}