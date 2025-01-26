import { relations } from 'drizzle-orm';
import { pgTable, real, timestamp, uuid } from 'drizzle-orm/pg-core';
import { User } from '../users/schema';
import { PmEvent } from '../events/schema';

export const Day = pgTable('days', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => User.id),
  start: real('start').default(0),
  day: timestamp('day').notNull().defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const dayRelations = relations(Day, ({ one, many }) => ({
  user: one(User, { fields: [Day.userId], references: [User.id] }),
  events: many(PmEvent),
}));
