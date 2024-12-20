import { Injectable } from '@nestjs/common';

@Injectable()
export class SubtasksService {
  create(createSubtaskDto) {
    return 'This action adds a new subtask';
  }

  findAll() {
    return `This action returns all subtasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subtask`;
  }

  update(id: number, updateSubtaskDto) {
    return `This action updates a #${id} subtask`;
  }

  remove(id: number) {
    return `This action removes a #${id} subtask`;
  }
}
