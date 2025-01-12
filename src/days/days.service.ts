import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, gte, lte } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from './schema';
import { getHourWithFraction, makeDate } from 'src/common/utils';

@Injectable()
export class DaysService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof import('./schema')>,
  ) {}

  async getDay(userId: string, dayParam?: Date) {
    const whereClause = [eq(schema.Day.userId, userId)];

    const today = dayParam || makeDate(new Date().toISOString());

    whereClause.push(eq(schema.Day.day, today));

    const requestedDay = await this.database.query.Day.findFirst({
      where: and(...whereClause),
      columns: {
        userId: false,
      },
      with: {
        events: {
          columns: {
            userId: false,
          },
          with: {
            logs: {
              columns: {
                userId: false,
              },
            },
            task: {
              columns: {
                userId: false,
              },
            },
          },
        },
      },
    });

    if (requestedDay) {
      return requestedDay;
    } else {
      const currentDay = await this.database
        .insert(schema.Day)
        .values({
          userId: userId,
          day: today,
          start: getHourWithFraction(new Date()),
        })
        .returning();
      return currentDay[0];
    }
  }

  getDays(userId: string, start?: Date, end?: Date) {
    const whereClause = [
      eq(schema.Day.userId, userId),
      gte(schema.Day.day, start),
      lte(schema.Day.day, end),
    ];

    return this.database.query.Day.findMany({
      where: and(...whereClause),
      orderBy: [asc(schema.Day.day)],
      columns: {
        userId: false,
      },
    });
  }

  updateDay(userId: string, dayId: string, start: number) {
    return this.database
      .update(schema.Day)
      .set({ start })
      .where(and(eq(schema.Day.id, dayId), eq(schema.Day.userId, userId)))
      .returning();
  }

  getStats(userId: string) {
    return this.database.query.Day.findMany({
      where: and(eq(schema.Day.userId, userId)),
      orderBy: [asc(schema.Day.createdAt)],
      columns: {
        start: true,
        day: true,
      },
      with: {
        events: {
          columns: {
            title: true,
          },
          with: {
            task: {
              columns: {
                title: true,
                jiraLink: true,
              },
            },
            logs: {
              columns: {
                title: true,
                duration: true,
              },
            },
          },
        },
      },
    });
  }
}
