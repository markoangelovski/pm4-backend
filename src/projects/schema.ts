import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { desc, relations } from 'drizzle-orm';
import { User } from '../users/schema';
import { title } from 'process';
import { platform } from 'os';

export const Project = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => User.id),
  title: text('title').notNull(),
  description: text('description'),
  pl: text('pl'),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const projectRelations = relations(Project, ({ one, many }) => ({
  user: one(User, { fields: [Project.userId], references: [User.id] }),
  // tasks: many(Task),
}));
