import { pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const User = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  username: text('username').unique(),
  password: text('password'),
});
