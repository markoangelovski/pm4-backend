import { pgTable, serial, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { Project } from '../projects/schema';

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
  // tasks: many(Task),
  // notes: many(Note),
  // days: many(Day),
  // events: many(Event),
  // bookings: many(Booking),
}));
