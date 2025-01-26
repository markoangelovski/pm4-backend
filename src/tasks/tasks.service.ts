import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { and, eq, or, ilike, count, asc } from 'drizzle-orm';
import { UpdateTaskDto } from './dto/task.dto';
import { title } from 'process';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof import('./schema')>,
  ) {}

  async countTasks(
    userId: string,
    projectId?: string,
    status?: string,
    pl?: string,
    q?: string,
  ) {
    const whereClause = [eq(schema.Task.userId, userId)];

    if (projectId) {
      whereClause.push(eq(schema.Task.projectId, projectId));
    }
    if (status) {
      whereClause.push(eq(schema.Task.status, status));
    }
    if (pl) {
      whereClause.push(eq(schema.Task.pl, pl));
    }
    if (q) {
      whereClause.push(
        or(
          ilike(schema.Task.title, `%${q}%`),
          ilike(schema.Task.description, `%${q}%`),
          ilike(schema.Task.pl, `%${q}%`),
        ),
      );
    }
    return this.database
      .select({ count: count(schema.Task.id) })
      .from(schema.Task)
      .where(and(...whereClause));
  }

  async getTasks(
    userId: string,
    limit: number,
    offset: number,
    projectId?: string,
    status?: string,
    pl?: string,
    q?: string,
  ) {
    const whereClause = [eq(schema.Task.userId, userId)];

    if (projectId) {
      whereClause.push(eq(schema.Task.projectId, projectId));
    }
    if (status) {
      whereClause.push(eq(schema.Task.status, status));
    }
    if (pl) {
      whereClause.push(eq(schema.Task.pl, pl));
    }
    if (q) {
      whereClause.push(
        or(
          ilike(schema.Task.title, `%${q}%`),
          ilike(schema.Task.description, `%${q}%`),
          ilike(schema.Task.pl, `%${q}%`),
        ),
      );
    }
    return this.database.query.Task.findMany({
      where: and(...whereClause),
      orderBy: [asc(schema.Task.title)],
      limit,
      offset,
      columns: {
        userId: false,
      },
      with: {
        project: {
          columns: { title: true },
        },
      },
    });
  }

  async getTask(taskId: string, userId: string) {
    return this.database.query.Task.findFirst({
      where: and(eq(schema.Task.id, taskId), eq(schema.Task.userId, userId)),
      columns: {
        userId: false,
      },
      with: {
        project: {
          columns: { title: true },
        },
      },
    });
  }

  async createTask(taskData: typeof schema.Task.$inferInsert) {
    return this.database.insert(schema.Task).values(taskData).returning();
  }

  async updateTask(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.database
      .update(schema.Task)
      .set(updateTaskDto)
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
//
//   return { upcomingTasksCount, inProgressTasksCount, completedTasksCount };
// }
