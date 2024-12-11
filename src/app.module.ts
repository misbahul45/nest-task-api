import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { TaskStatusModule } from './task-status/task-status.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [AuthModule, CommonModule, TasksModule, UsersModule, SubtasksModule, TaskStatusModule, CommentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
