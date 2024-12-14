import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { eq, and } from 'drizzle-orm';
import { CreateEventDto } from './dto/create-event.dto';
import * as schema from './schema';

@Injectable()
export class EventsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof import('./schema')>,
  ) {}
  async getEvents() {
    const events = await this.database.query.PmEvent.findMany({
      with: {
        logs: true,
      },
    });
    return events.map((event) => ({
      ...event,
      userId: undefined,
      logs: event.logs.map((log) => ({
        ...log,
        userId: undefined,
        eventId: undefined,
      })),
    }));
  }

  async createEvent(createEventDto: CreateEventDto) {
    const event = await this.database
      .insert(schema.PmEvent)
      .values({
        title: createEventDto.title,
        day: createEventDto.day,
        taskId: createEventDto.taskId,
        userId: createEventDto.userId,
      })
      .returning();
    await this.database.insert(schema.Log).values({
      title: createEventDto.logTitle,
      duration: createEventDto.duration,
      eventId: event[0].id,
      userId: createEventDto.userId,
    });
    return event;
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
}
