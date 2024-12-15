import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { eq, and } from 'drizzle-orm';
import { CreateEventDto } from './dto/create-event.dto';
import * as schema from './schema';
import { format } from 'date-fns';
import { UpdateLogDto } from './dto/update-log.dto';
import { CreateLogDto } from './dto/create-log.dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class EventsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof import('./schema')>,
    private readonly tasksService: TasksService,
  ) {}
  async getEvents(userId: string, day?: string, taskId?: string) {
    const whereClause = [eq(schema.PmEvent.userId, userId)];

    if (taskId) {
      whereClause.push(eq(schema.PmEvent.taskId, taskId));
    } else {
      day = day || format(new Date(), 'yyyy-MM-dd');
      whereClause.push(eq(schema.PmEvent.day, day));
    }

    return this.database.query.PmEvent.findMany({
      where: and(...whereClause),
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

  async createEvent(createEventDto: CreateEventDto) {
    let task = null;

    if (createEventDto.taskId) {
      task = await this.tasksService.getTask(
        createEventDto.taskId,
        createEventDto.userId,
      );
      if (!task) {
        throw new NotFoundException('Task not found');
      }
    }

    const event = await this.database
      .insert(schema.PmEvent)
      .values({
        title: createEventDto.title,
        day: createEventDto.day || format(new Date(), 'yyyy-MM-dd'),
        taskId: createEventDto.taskId,
        userId: createEventDto.userId,
      })
      .returning();
    const log = await this.database
      .insert(schema.Log)
      .values({
        title: createEventDto.logTitle || createEventDto.title,
        duration: createEventDto.duration,
        eventId: event[0].id,
        userId: createEventDto.userId,
      })
      .returning();

    return { ...event[0], logs: log, task };
  }

  async updateEvent(
    eventId: string,
    userId: string,
    updateEventDto: CreateEventDto,
  ) {
    return this.database
      .update(schema.PmEvent)
      .set({
        title: updateEventDto.title,
        day: updateEventDto.day,
        taskId: updateEventDto.taskId,
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

  async createLog(createLogDto: CreateLogDto) {
    return this.database
      .insert(schema.Log)
      .values({
        title: createLogDto.title,
        duration: createLogDto.duration,
        eventId: createLogDto.eventId,
        userId: createLogDto.userId,
      })
      .returning();
  }

  async updateLog(logId: string, userId: string, updateLogDto: UpdateLogDto) {
    return this.database
      .update(schema.Log)
      .set({
        title: updateLogDto.title,
        duration: updateLogDto.duration,
      })
      .where(and(eq(schema.Log.id, logId), eq(schema.Log.userId, userId)))
      .returning();
  }

  async deleteLog(logId: string, userId: string) {
    return this.database
      .delete(schema.Log)
      .where(and(eq(schema.Log.id, logId), eq(schema.Log.userId, userId)))
      .returning();
  }
}
