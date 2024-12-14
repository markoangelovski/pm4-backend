import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async getUsers() {
    return this.database.query.User.findMany();
  }

  async findOne(username: string) {
    return this.database.query.User.findFirst({
      where: eq(schema.User.username, username),
    });
  }

  async createUser(user: typeof schema.User.$inferInsert) {
    const userToInsert = await this.authService.register(user);

    return this.database.insert(schema.User).values(userToInsert).returning({
      id: schema.User.id,
      email: schema.User.email,
      username: schema.User.username,
    });
  }
}
