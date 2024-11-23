import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { User } from '../users/schema';

export const Project = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => User.id),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const projectRelations = relations(Project, ({ one, many }) => ({
  user: one(User, { fields: [Project.userId], references: [User.id] }),
  // tasks: many(Task),
}));
