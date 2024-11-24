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
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { validate } from 'class-validator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(@Request() req) {
    return this.projectsService.getProjects(req.user.userId);
  }

  @Get(':projectId')
  async getProject(@Request() req, @Param('projectId') projectId: string) {
    return this.projectsService.getProject(projectId, req.user.userId);
  }

  @Post()
  async createProject(
    @Request() req,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const errors = await validate(createProjectDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.projectsService.createProject({
      ...createProjectDto,
      userId: req.user.userId,
    });
  }

  @Patch(':projectId')
  async editProject(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: CreateProjectDto,
  ) {
    const errors = await validate(updateProjectDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.projectsService.editProject(
      projectId,
      req.user.userId,
      updateProjectDto,
    );
  }

  @Delete(':projectId')
  async deleteProject(@Request() req, @Param('projectId') projectId: string) {
    return this.projectsService.deleteProject(projectId, req.user.userId);
  }
}
