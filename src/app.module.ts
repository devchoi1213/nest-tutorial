import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import {AppController} from "./app.controller";
import emailConfig from "./config/emailConfig";
import {validationSchema} from "./config/emailConfig.validation";
import databaseConfig from "./config/databaseConfig";

//TODO @nestjs/config 패키지를 사용하지 않고 .env 파일이 존재하는 folder를 
// 동적으로 전달할 수 있는 커스텀 동적 모듈 구현하기

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, databaseConfig],
      isGlobal: true,
      validationSchema,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
