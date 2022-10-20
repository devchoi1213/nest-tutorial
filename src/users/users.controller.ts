import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import {UsersService} from "./users.service";
import {AuthGuard} from "../guard/auth.guard";
import {User} from "../decorator/user.decorator";
import {UserInfoEntity} from "./entity/userInfo.entity";
import {Roles} from "../decorator/role.decorater";
import {CreateUserCommand} from "./command/creat-user.command";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {LoginCommand} from "./command/login.command";
import {VerifyEmailCommand} from "./command/verify-email.command";
import {GetUserInfoQuery} from "./query/get-user-info.query";

@Roles('user')
@Controller('users')
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) { }


    @Post()
    @Roles('admin')
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        const { name, email, password } = dto;

        const command = new CreateUserCommand(name, email, password);
        return this.commandBus.execute(command);
    }

    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signupVerifyToken } = dto;

        const command = new VerifyEmailCommand(signupVerifyToken);
        return this.commandBus.execute(command);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const { email, password } = dto;

        const command = new LoginCommand(email, password);
        return this.commandBus.execute(command);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfoEntity> {
        const getUserInfoQuery = new GetUserInfoQuery(userId);

        return this.queryBus.execute(getUserInfoQuery);
    }

    @UseGuards(AuthGuard)
    @Roles('admin')
    @Get()
    getHello(@User(new ValidationPipe({ validateCustomDecorators: true })) user: UserInfoEntity) {
        // throw new BadRequestException('test')
        console.log(user);
    }

    @UseGuards(AuthGuard)
    @Get('/username')
    getHello2(@User('name') name: string) {
        console.log(name);
    }
}