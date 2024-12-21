import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { json, urlencoded } from 'express';

@Module({
  imports: [
    AuthModule, 
    CommonModule, 
    TasksModule, 
    UsersModule, 
    SubtasksModule, 
    CommentsModule,
    ConfigModule.forRoot({ isGlobal:true })
  ],
})
export class AppModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(json(), urlencoded({extended: true})).forRoutes('*')
  }
}
