import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
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
    const user = await this.database.query.User.findFirst({
      where: eq(schema.User.username, username),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(user: typeof schema.User.$inferInsert) {
    try {
      const userToInsert = await this.authService.register(user);

      const newUser = await this.database
        .insert(schema.User)
        .values(userToInsert)
        .returning({
          id: schema.User.id,
          email: schema.User.email,
          username: schema.User.username,
        });
      return newUser;
    } catch (error) {
      console.error('Error in user.service.createUser: ', error);
      throw error; // Re-throw other errors
    }
  }
}
