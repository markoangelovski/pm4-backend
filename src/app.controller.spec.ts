import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({}), UsersModule], // Add imports for JwtModule and UsersModule
      controllers: [AppController],
      providers: [AppService, AuthService], // Add AuthService to providers
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
