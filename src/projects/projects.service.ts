import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { and, eq, count } from 'drizzle-orm';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async countProjects(userId: string) {
    return this.database
      .select({ count: count(schema.Project.id) })
      .from(schema.Project)
      .where(eq(schema.Project.userId, userId));
  }

  async getProjects(userId: string, limit: number, offset: number) {
    return this.database.query.Project.findMany({
      where: eq(schema.Project.userId, userId),
      limit,
      offset,
      columns: {
        userId: false,
      },
    });
  }

  async getProject(projectId: string, userId: string) {
    return this.database.query.Project.findFirst({
      where: and(
        eq(schema.Project.id, projectId),
        eq(schema.Project.userId, userId),
      ),
      columns: {
        userId: false,
      },
    });
  }

  async createProject(projectData: typeof schema.Project.$inferInsert) {
    return this.database.insert(schema.Project).values(projectData).returning();
  }

  async editProject(
    projectId: string,
    projectData: typeof schema.Project.$inferInsert,
  ) {
    return this.database
      .update(schema.Project)
      .set(projectData)
      .where(
        and(
          eq(schema.Project.id, projectId),
          eq(schema.Project.userId, projectData.userId),
        ),
      )
      .returning();
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

  // async updateProjectTasksCounts(projectId: string) {

  //   const { upcomingTasksCount, inProgressTasksCount, completedTasksCount } = await getTaskStatusCounts(projectId);

  //   return this.database.update(schema.Project).set({ upcomingTasksCount, inProgressTasksCount, completedTasksCount }).where(eq(schema.Project.id, projectId)).returning();
  // }
}
