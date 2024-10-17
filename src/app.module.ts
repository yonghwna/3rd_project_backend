import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import mongoose from 'mongoose';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
    //디버그 도구인데, 매 요청마다 발생하는 모든 쿼리가 콘솔에 출력된다.
  }
}
