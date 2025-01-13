import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { DaysService } from 'src/days/days.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [StatsService, DaysService],
  controllers: [StatsController],
})
export class StatsModule {}
