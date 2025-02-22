import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { eq, and, gte, lte, asc } from 'drizzle-orm';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import * as schema from './schema';
import { CreateLogDto, UpdateLogDto } from './dto/log.dto';
import { TasksService } from '../tasks/tasks.service';
import { DaysService } from '../days/days.service';
import { getHourWithFraction, makeDate } from '../common/utils';

@Injectable()
export class EventsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof import('./schema')>,
    private readonly tasksService: TasksService,
    private readonly daysService: DaysService,
  ) {}
  async getEvents(userId: string, day?: Date, taskId?: string) {
    const whereClause = [eq(schema.PmEvent.userId, userId)];

    if (taskId) {
      whereClause.push(eq(schema.PmEvent.taskId, taskId));
    } else {
      whereClause.push(eq(schema.PmEvent.day, day));
    }

    return this.database.query.PmEvent.findMany({
      where: and(...whereClause),
      orderBy: [asc(schema.PmEvent.day)],
      columns: {
        userId: false,
        taskId: false,
      },
      with: {
        logs: {
          columns: {
            userId: false,
            eventId: false,
          },
        },
        task: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async createEvent(userId: string, createEventDto: CreateEventDto) {
    let task = null;

    if (createEventDto.taskId) {
      task = await this.tasksService.getTask(createEventDto.taskId, userId);
      if (!task) {
        throw new NotFoundException('Task not found: ' + createEventDto.taskId);
      }
    }

    const day = await this.daysService.getDay(userId, createEventDto.day);

    const event = await this.database
      .insert(schema.PmEvent)
      .values({
        title: createEventDto.title,
        day: createEventDto.day,
        dayId: day.id,
        taskId: createEventDto.taskId || null,
        userId: userId,
      })
      .returning();
    const log = await this.database
      .insert(schema.Log)
      .values({
        title: createEventDto.logTitle || createEventDto.title,
        duration: createEventDto.duration,
        eventId: event[0].id,
        userId: userId,
      })
      .returning();

    return { ...event[0], logs: log, task };
  }

  async updateEvent(
    userId: string,
    eventId: string,
    updateEventDto: UpdateEventDto,
  ) {
    let day = null;

    if (updateEventDto.day) {
      day = await this.daysService.getDay(userId, updateEventDto.day);
    }

    return this.database
      .update(schema.PmEvent)
      .set({
        ...updateEventDto,
        dayId: day?.id,
      })
      .where(
        and(eq(schema.PmEvent.id, eventId), eq(schema.PmEvent.userId, userId)),
      )
      .returning();
  }

  async deleteEvent(eventId: string, userId: string) {
    return this.database
      .delete(schema.PmEvent)
      .where(
        and(eq(schema.PmEvent.id, eventId), eq(schema.PmEvent.userId, userId)),
      )
      .returning();
  }

  async createLog(userId: string, createLogDto: CreateLogDto) {
    return this.database
      .insert(schema.Log)
      .values({
        userId: userId,
        title: createLogDto.title,
        duration: createLogDto.duration,
        eventId: createLogDto.eventId,
      })
      .returning();
  }

  async updateLog(userId: string, logId: string, updateLogDto: UpdateLogDto) {
    return this.database
      .update(schema.Log)
      .set({
        title: updateLogDto.title,
        duration: updateLogDto.duration,
      })
      .where(and(eq(schema.Log.id, logId), eq(schema.Log.userId, userId)))
      .returning();
  }

  async deleteLog(userId: string, logId: string) {
    return this.database
      .delete(schema.Log)
      .where(and(eq(schema.Log.id, logId), eq(schema.Log.userId, userId)))
      .returning();
  }
}
