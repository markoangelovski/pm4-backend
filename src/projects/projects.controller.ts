import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Param,
  BadRequestException,
  Delete,
  Patch,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { validate } from 'class-validator';
import { ParseLimitOffsetPipe } from 'src/common/pipes/parse-limit-offset';

@Controller('/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('/')
  async getProjects(
    @Request() req,
    @Query('limit', new ParseLimitOffsetPipe()) limit: number,
    @Query('offset', new ParseLimitOffsetPipe()) offset: number,
  ) {
    const [totalResults, projects] = await Promise.all([
      this.projectsService.countProjects(req.user.userId),
      this.projectsService.getProjects(req.user.userId, limit, offset),
    ]);

    return {
      limit,
      offset,
      totalResults: totalResults[0].count,
      results: projects,
    };
  }

  @Get('/:projectId')
  async getProject(
    @Request() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return {
      results: await this.projectsService.getProject(
        projectId,
        req.user.userId,
      ),
    };
  }

  @Post('/')
  async createProject(
    @Request() req,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return {
      results: await this.projectsService.createProject({
        userId: req.user.userId,
        ...createProjectDto,
      }),
    };
  }

  @Patch('/:projectId')
  async editProject(
    @Request() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return {
      results: await this.projectsService.editProject(
        req.user.userId,
        projectId,
        updateProjectDto,
      ),
    };
  }

  @Delete('/:projectId')
  async deleteProject(
    @Request() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return {
      results: await this.projectsService.deleteProject(
        projectId,
        req.user.userId,
      ),
    };
  }
}
