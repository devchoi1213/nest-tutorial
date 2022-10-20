import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {EmailModule} from "../email/email.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entity/user.entity";
import {AuthModule} from "../auth/auth.module";
import { CqrsModule } from '@nestjs/cqrs';
import {CreateUserHandler} from "./command/creat-user.handler";
import {LoginHandler} from "./command/login.handler";
import {VerifyEmailHandler} from "./command/verify-email.handler";
import {GetUserInfoQueryHandler} from "./query/get-user-info.handler";
import {UserEventsHandler} from "./event/user-events.handler";

const commandHandlers = [
    CreateUserHandler,
    VerifyEmailHandler,
    LoginHandler,
    // VerifyAccessTokenHandler,
];

const queryHandlers = [
    GetUserInfoQueryHandler,
];

const eventHandlers = [
    UserEventsHandler,
]

@Module({
    imports: [
        EmailModule,
        AuthModule,
        TypeOrmModule.forFeature([UserEntity]), // 유저 모듈 내에서 사용할 저장소를 등록
        CqrsModule,
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        ...commandHandlers,
        ...queryHandlers,
        ...eventHandlers,
    ],
})
export class UsersModule { }