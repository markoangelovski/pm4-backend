import { pgTable, serial, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { Project } from '../projects/schema';
import { Task } from '../tasks/schema';
import { Log, PmEvent } from 'src/events/schema';
import { Day } from 'src/days/schema';

export const User = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  username: text('username').unique(),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const userRelations = relations(User, ({ one, many }) => ({
  projects: many(Project),
  tasks: many(Task),
  // notes: many(Note),
  days: many(Day),
  events: many(PmEvent),
  logs: many(Log),
  // bookings: many(Booking),
}));
