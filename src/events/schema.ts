import { pgTable, uuid, timestamp, text, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { User } from '../users/schema';
import { Task } from '../tasks/schema';
import { Day } from '../days/schema';

export const PmEvent = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => User.id),
  taskId: uuid('task_id').references(() => Task.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  day: timestamp('day').notNull().defaultNow(),
  dayId: uuid('day_id').references(() => Day.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const eventRelations = relations(PmEvent, ({ one, many }) => ({
  user: one(User, { fields: [PmEvent.userId], references: [User.id] }),
  task: one(Task, { fields: [PmEvent.taskId], references: [Task.id] }),
  day: one(Day, { fields: [PmEvent.dayId], references: [Day.id] }),
  logs: many(Log),
}));

export const Log = pgTable('logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => User.id),
  eventId: uuid('event_id')
    .notNull()
    .references(() => PmEvent.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  duration: real('duration').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const logRelations = relations(Log, ({ one, many }) => ({
  user: one(User, { fields: [Log.userId], references: [User.id] }),
  event: one(PmEvent, { fields: [Log.eventId], references: [PmEvent.id] }),
}));
