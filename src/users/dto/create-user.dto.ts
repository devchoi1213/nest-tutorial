import {IsString, MinLength, MaxLength, IsEmail, Matches} from 'class-validator';
import {Transform} from "class-transformer";
import {NotIn} from "./decorators/notin.decorator";

export class CreateUserDto {
    @Transform(params => params.value.trim())
    @NotIn('password', { message: 'password는 name과 같은 문자열을 포함할 수 없습니다.' })
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