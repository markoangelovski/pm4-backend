import { Module } from '@nestjs/common';
import { DaysService } from './days.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [DaysService],
})
export class DaysModule {}
