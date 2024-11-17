import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { users } from '../users/schema';
import { relations } from 'drizzle-orm';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content'),
  published: boolean('published').default(false),
  timestamp: timestamp('timestamp').defaultNow(),
  userId: uuid('user_id').references(() => users.id),
});

export const postRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
