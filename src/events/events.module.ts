import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { DatabaseModule } from '../database/database.module';
import { TasksService } from '../tasks/tasks.service';

@Module({
  imports: [DatabaseModule],
  providers: [EventsService, TasksService],
  controllers: [EventsController],
})
export class EventsModule {}
