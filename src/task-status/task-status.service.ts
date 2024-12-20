import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskStatusService {
  create(createTaskStatusDto) {
    return 'This action adds a new taskStatus';
  }

  findAll() {
    return `This action returns all taskStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskStatus`;
  }

  update(id: number, updateTaskStatusDto) {
    return `This action updates a #${id} taskStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskStatus`;
  }
}
