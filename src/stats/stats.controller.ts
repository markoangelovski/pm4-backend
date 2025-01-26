import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DaysService } from 'src/days/days.service';
import { ParseDayFormatPipe } from 'src/common/pipes';

@Controller('/stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly daysService: DaysService) {}

  @Get('/')
  async getEvents(
    @Request() req,
    @Query('start', new ParseDayFormatPipe()) start: Date,
    @Query('end', new ParseDayFormatPipe()) end: Date,
  ) {
    return {
      results: await this.daysService.getStats(req.user.userId, start, end),
    };
  }
}
