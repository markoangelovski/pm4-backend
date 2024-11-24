import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { User } from '../users/schema';
import { Project } from '../projects/schema';

export const Task = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => User.id),
  projectId: uuid('project_id')
    .notNull()
    .references(() => Project.id),
  title: text('title').notNull(),
  description: text('description'),
  pl: text('pl'),
  jiraLink: text('jira_link'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  modifiedAt: timestamp('modified_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const taskRelations = relations(Task, ({ one, many }) => ({
  user: one(User, { fields: [Task.userId], references: [User.id] }),
  project: one(Project, { fields: [Task.projectId], references: [Project.id] }),
  // notes: many(Note),
  // events: many(Event),
}));
