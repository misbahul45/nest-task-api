import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskTypes } from 'src/types/task.types';
import { REQUEST, WebResponse } from 'src/types/web.types';
import { ValidationService } from 'src/common/validation.service';
import { TASKVALIDATION } from './task.validation';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly validationService:ValidationService
  ) {}

  @Post()
  async create(@Body() body: TaskTypes.CREATE_TASK) : Promise<WebResponse<TaskTypes.CREATE_TASK>> {
      const result=await this.tasksService.create(body);
      return{
        data:result,
        success:true,
        message:"Task created successfully"
      }
  }

  @Get('')
  async findAll(@Request() req:REQUEST): Promise<WebResponse<TaskTypes.TASK[]>> {
    try {
      const tasks = await this.tasksService.findAll(req.user.id);
      return {
        data:tasks,
        success:true,
        message:"Tasks fetched successfully"
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<WebResponse<TaskTypes.TASK>> {
    id=this.validationService.validate(TASKVALIDATION.ID, id);
    try {
      const task= await this.tasksService.findOne(id);
      return{
        success:true,
        data:task,
        message:"Task fetched successfully"
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTask: TaskTypes.UPDATE_TASK) : Promise<WebResponse<TaskTypes.UPDATE_TASK>> {
    id=this.validationService.validate(TASKVALIDATION.ID, id);
    console.log(id);

    updateTask=this.validationService.validate(TASKVALIDATION.UPDATE, updateTask);
    try {
      const taskUpdate=await this.tasksService.update(id, updateTask);
      return{
        message:`Task updated successfully`,
        success:true,
        data:taskUpdate
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<WebResponse<null>> {
    id=this.validationService.validate(TASKVALIDATION.ID, id);
    try {
      const data= await this.tasksService.remove(id);
      return{
        success:true,
        message:"Task deleted successfully",
        data
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
