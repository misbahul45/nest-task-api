import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskStatusService } from './task-status.service';

@Controller('task-status')
export class TaskStatusController {
  constructor(private readonly taskStatusService:TaskStatusService) {}

  @Post()
  create(@Body() createTaskStatusDto) {
    return this.taskStatusService.create(createTaskStatusDto);
  }
  
  @Get()
  findAll() {
    return this.taskStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskStatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskStatusDto) {
    return this.taskStatusService.update(+id, updateTaskStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskStatusService.remove(+id);
  }
}
