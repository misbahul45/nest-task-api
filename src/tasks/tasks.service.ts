import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { TaskTypes } from 'src/types/task.types';
import { TASKVALIDATION } from './task.validation';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class TasksService {
  constructor(
    private readonly prisma:PrismaService,
    private readonly validationService:ValidationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ){}
  async create(newTask:TaskTypes.CREATE_TASK) : Promise<TaskTypes.CREATE_TASK> {
    let task=this.validationService.validate(TASKVALIDATION.CREATE,newTask);

    try {
      task=await this.prisma.task.create({
        data:{
          title:task.title,
          description:task.description,
          dueDate:task.dueDate,
          status:task.status,
          createdById:task.createdById
        }
      })
      return task;
    } catch (error) {
      this.logger.error('Error creating task', { error });
      if (error.code === 'P2002') {
        throw new Error('A task with the same unique field already exists');
      }
      throw error;
    }
  }


  async findAll(userId:string) : Promise<TaskTypes.TASK[]> {
    try {
      const tasks=await this.prisma.task.findMany({
        where: {
          createdById: userId,
        },
      })
      if(!tasks) throw new Error('Tasks not found');

      return tasks as TaskTypes.TASK[]
    } catch (error) {
      this.logger.error('Error fetching tasks', { error });
      throw error;
    }
  }

  async findOne(id: string):  Promise<TaskTypes.TASK> {
    try {
      const task=await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      })
      if(!task) throw new Error('Task not found');
      return task as TaskTypes.TASK
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTask: TaskTypes.UPDATE_TASK) : Promise<TaskTypes.UPDATE_TASK> {
    try {
     
  
      const taskUpdate=await this.prisma.task.update({
        where:{
          id
        },
        data:{
          ...updateTask
        }
      })
      if(!taskUpdate) throw new Error('Task not found');

      return taskUpdate
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) : Promise<null> {
    try {
      const taskDelete=await this.prisma.task.delete({
        where: {
          id: id,
        },
      })

      if(!taskDelete) throw new Error('Task not found');
      return null
    } catch (error) {
      throw error;
    }
  }
}
