import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  BadRequestException,
  Param,
  Patch,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { validate } from 'class-validator';

@Controller('/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  async getTasks(
    @Request() req,
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
  ) {
    return this.tasksService.getTasks(req.user.userId, projectId, status);
  }

  @Get('/search')
  async searchTask(@Request() req, @Query('q') q: string) {
    return this.tasksService.searchTask(q, req.user.userId);
  }

  @Get('/:taskId')
  async getTask(@Request() req, @Param('taskId') taskId: string) {
    return this.tasksService.getTask(taskId, req.user.userId);
  }

  @Post('/')
  async createTask(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const errors = await validate(createTaskDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.tasksService.createTask({
      ...createTaskDto,
      userId: req.user.userId,
    });
  }

  @Patch('/:taskId')
  async updateTask(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: CreateTaskDto,
  ) {
    const errors = await validate(updateTaskDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.tasksService.updateTask(taskId, req.user.userId, updateTaskDto);
  }

  @Delete('/:taskId')
  async deleteTask(@Request() req, @Param('taskId') taskId: string) {
    return this.tasksService.deleteTask(taskId, req.user.userId);
  }
}
