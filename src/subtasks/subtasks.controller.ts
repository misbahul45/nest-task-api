import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';

@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  create(@Body() createSubtaskDto) {
    return this.subtasksService.create(createSubtaskDto);
  }

  @Get()
  findAll() {
    return this.subtasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subtasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubtaskDto) {
    return this.subtasksService.update(+id, updateSubtaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(+id);
  }
}
