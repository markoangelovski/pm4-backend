import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getProjects(userId: string) {
    return this.database.query.Project.findMany({
      where: eq(schema.Project.userId, userId),
    });
  }

  async getProject(projectId: string, userId: string) {
    return this.database.query.Project.findFirst({
      where: and(
        eq(schema.Project.id, projectId),
        eq(schema.Project.userId, userId),
      ),
    });
  }

  async createProject(projectData: typeof schema.Project.$inferInsert) {
    return this.database.insert(schema.Project).values(projectData).returning();
  }

  async deleteProject(projectId: string, userId: string) {
    return this.database
      .delete(schema.Project)
      .where(
        and(
          eq(schema.Project.id, projectId),
          eq(schema.Project.userId, userId),
        ),
      )
      .returning();
  }
}
