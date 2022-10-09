import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  //  요청값 변경 허용 여부 (class-transformer 에서 요청값 변경 될 수 있기 때문)
  }));
  await app.listen(3000);
}
bootstrap();
