import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Param,
  Patch,
  Delete,
  Query,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLogDto, UpdateLogDto } from './dto/log.dto';
import { ParseDayFormatPipe } from 'src/common/pipes';

@Controller('/events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/')
  async getEvents(
    @Request() req,
    @Query('day', new ParseDayFormatPipe()) day?: string,
    @Query('taskId', new ParseUUIDPipe({ optional: true })) taskId?: string,
  ) {
    return {
      results: await this.eventsService.getEvents(req.user.userId, day, taskId),
    };
  }

  @Post('/')
  async createEvent(@Request() req, @Body() createEventDto: CreateEventDto) {
    return {
      results: await this.eventsService.createEvent(
        req.user.userId,
        createEventDto,
      ),
    };
  }

  @Patch('/:eventId')
  async updateEvent(
    @Request() req,
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return {
      results: await this.eventsService.updateEvent(
        req.user.userId,
        eventId,
        updateEventDto,
      ),
    };
  }

  @Delete('/:eventId')
  async deleteEvent(
    @Request() req,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    return {
      results: await this.eventsService.deleteEvent(eventId, req.user.userId),
    };
  }

  @Post('/logs')
  async createLog(@Request() req, @Body() createLogDto: CreateLogDto) {
    return {
      results: await this.eventsService.createLog(
        req.user.userId,
        createLogDto,
      ),
    };
  }

  @Patch('/logs/:logId')
  async updateLog(
    @Request() req,
    @Body() updateLogDto: UpdateLogDto,
    @Param('logId', ParseUUIDPipe) logId: string,
  ) {
    return {
      results: await this.eventsService.updateLog(
        req.user.userId,
        logId,
        updateLogDto,
      ),
    };
  }

  @Delete('/logs/:logId')
  async deleteLog(
    @Request() req,
    @Param('logId', ParseUUIDPipe) logId: string,
  ) {
    return {
      results: await this.eventsService.deleteLog(req.user.userId, logId),
    };
  }
}
