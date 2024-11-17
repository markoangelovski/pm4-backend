import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection'; // Adjust path if necessary
import * as schema from './schema'; // Assuming you have a schema file

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getPosts() {
    return this.database.query.posts.findMany({
      with: {
        user: true,
      },
    });
  }

  async createPost(post: typeof schema.posts.$inferInsert) {
    return this.database.insert(schema.posts).values(post).returning();
  }
}
