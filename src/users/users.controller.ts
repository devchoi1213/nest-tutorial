import {Body, Controller, Delete, Get, Param, Post, Query, ValidationPipe} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import {UsersService} from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
        const { name, email, password } = dto;
        await this.usersService.createUser(name, email, password);
    }

    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signupVerifyToken } = dto;

        return await this.usersService.verifyEmail(signupVerifyToken);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const { email, password } = dto;

        return await this.usersService.login(email, password);
    }

    @Get('/:id')
    async getUserInfo(@Param('id') userId: string): Promise<string> {
        return await this.usersService.getUserInfo(userId);
    }
}