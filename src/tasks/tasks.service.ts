import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { and, eq, or } from 'drizzle-orm';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof import('./schema')>,
  ) {}

  async getTasks(userId: string, projectId?: string, status?: string) {
    const whereClause = [eq(schema.Task.userId, userId)];

    if (projectId) {
      whereClause.push(eq(schema.Task.projectId, projectId));
    }
    if (status) {
      whereClause.push(eq(schema.Task.status, status));
    }
    return this.database.query.Task.findMany({
      where: and(...whereClause),
    });
  }

  async getTask(taskId: string, userId: string) {
    return this.database.query.Task.findFirst({
      where: and(eq(schema.Task.id, taskId), eq(schema.Task.userId, userId)),
    });
  }

  async createTask(taskData: typeof schema.Task.$inferInsert) {
    return this.database
      .insert(schema.Task)
      .values({ ...taskData, dueDate: new Date(taskData.dueDate) })
      .returning();
  }

  async updateTask(
    taskId: string,
    userId: string,
    updateTaskDto: typeof schema.Task.$inferInsert,
  ) {
    return this.database
      .update(schema.Task)
      .set({ ...updateTaskDto, dueDate: new Date(updateTaskDto.dueDate) })
      .where(and(eq(schema.Task.id, taskId), eq(schema.Task.userId, userId)))
      .returning();
  }

  async deleteTask(taskId: string, userId: string) {
    return this.database
      .delete(schema.Task)
      .where(and(eq(schema.Task.id, taskId), eq(schema.Task.userId, userId)))
      .returning();
  }
}

// async function getTaskStatusCounts(projectId: string) {
//   const upcomingTasksCount = await this.database.query.Task.count({
//     where: and(
//       eq(schema.Task.projectId, projectId),
//       eq(schema.Task.status, 'upcoming'),
//     ),
//     columns: { count: schema.Task.id },
//   });
//   const inProgressTasksCount = await this.database.query.Task.count({
//     where: and(
//       eq(schema.Task.projectId, projectId),
//       eq(schema.Task.status, 'in-progress'),
//     ),
//     columns: { count: schema.Task.id },
//   });
//   const completedTasksCount = await this.database.query.Task.count({
//     where: and(
//       eq(schema.Task.projectId, projectId),
//       eq(schema.Task.status, 'completed'),
//     ),
//     columns: { count: schema.Task.id },
//   });

//   return { upcomingTasksCount, inProgressTasksCount, completedTasksCount };
// }
