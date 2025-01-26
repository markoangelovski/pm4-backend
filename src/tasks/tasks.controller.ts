import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';
import { ParseLimitOffsetPipe } from 'src/common/pipes';

@Controller('/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  async getTasks(
    @Request() req,
    @Query('limit', new ParseLimitOffsetPipe()) limit: number,
    @Query('offset', new ParseLimitOffsetPipe()) offset: number,
    @Query('projectId', new ParseUUIDPipe({ optional: true }))
    projectId?: string,
    @Query('status') status?: string,
    @Query('pl') pl?: string,
    @Query('q') q?: string,
  ) {
    const [totalResults, tasks] = await Promise.all([
      this.tasksService.countTasks(req.user.userId, projectId, status, pl, q),
      this.tasksService.getTasks(
        req.user.userId,
        limit,
        offset,
        projectId,
        status,
        pl,
        q,
      ),
    ]);

    return {
      limit,
      offset,
      totalResults: totalResults[0].count,
      results: tasks,
    };
  }

  @Get('/:taskId')
  async getTask(
    @Request() req,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return {
      results: await this.tasksService.getTask(taskId, req.user.userId),
    };
  }

  @Post('/')
  async createTask(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return {
      results: await this.tasksService.createTask({
        userId: req.user.userId,
        ...createTaskDto,
      }),
    };
  }

  @Patch('/:taskId')
  async updateTask(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return {
      results: await this.tasksService.updateTask(
        req.user.userId,
        taskId,
        updateTaskDto,
      ),
    };
  }

  @Delete('/:taskId')
  async deleteTask(@Request() req, @Param('taskId') taskId: string) {
    return {
      results: await this.tasksService.deleteTask(taskId, req.user.userId),
    };
  }
}
