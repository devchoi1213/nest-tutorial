import {Body, Controller, Delete, Get, Param, Post, Query, ValidationPipe, Headers, UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import {UsersService} from "./users.service";
import {AuthService} from "../auth/auth.service";
import {UserInfo} from "./type/userInfo.type";
import {AuthGuard} from "../guard/auth.guard";
import {User} from "../decorator/user.decorator";

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { }

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
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

    @UseGuards(AuthGuard)
    @Get(':id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
        return this.usersService.getUserInfo(userId);
    }

    @Get()
    getHello(@User() user: UserInfo) {
        console.log(user);
    }

    @Get('/username')
    getHello2(@User('name') name: string) {
        console.log(name);
    }
}