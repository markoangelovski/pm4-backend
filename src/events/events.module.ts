import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { DatabaseModule } from '../database/database.module';
import { TasksService } from '../tasks/tasks.service';
import { DaysService } from 'src/days/days.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EventsController],
  providers: [EventsService, TasksService, DaysService],
})
export class EventsModule {}
