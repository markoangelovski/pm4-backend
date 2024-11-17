import { pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { posts } from '../posts/schema';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  password: text('password'),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
