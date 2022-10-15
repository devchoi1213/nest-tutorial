import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import {AppController} from "./app.controller";
import emailConfig from "./config/emailConfig";
import {validationSchema} from "./config/emailConfig.validation";
import databaseConfig from "./config/databaseConfig";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoggerMiddleware} from "./middleware/logger.middleware";
import authConfig from "./config/authConfig";
import {APP_GUARD} from "@nestjs/core";
import {RolesGuard} from "./guard/Roles.guard";

//TODO @nestjs/config 패키지를 사용하지 않고 .env 파일이 존재하는 folder를 
// 동적으로 전달할 수 있는 커스텀 동적 모듈 구현하기

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, databaseConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST, //'localhost',
      port: 3306,
      username: process.env.DATABASE_USERNAME, //'root',
      password: process.env.DATABASE_PASSWORD, //'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer
        .apply(LoggerMiddleware)
        .forRoutes('/users');
  }
}
