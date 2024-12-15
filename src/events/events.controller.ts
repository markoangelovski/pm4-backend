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
} from '@nestjs/common';
import { validate } from 'class-validator';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Controller('/events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/')
  async getEvents(
    @Request() req,
    @Query('day') day?: string,
    @Query('taskId') taskId?: string,
  ) {
    return this.eventsService.getEvents(req.user.userId, day, taskId);
  }

  @Post('/')
  async createEvent(@Request() req, @Body() createEventDto: CreateEventDto) {
    const errors = await validate(createEventDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.eventsService.createEvent({
      ...createEventDto,
      userId: req.user.userId,
    });
  }

  @Patch('/:eventId')
  async updateEvent(
    @Request() req,
    @Param('eventId') eventId: string,
    @Body() updateEventDto: CreateEventDto,
  ) {
    const errors = await validate(updateEventDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.eventsService.updateEvent(
      eventId,
      req.user.userId,
      updateEventDto,
    );
  }

  @Delete('/:eventId')
  async deleteEvent(@Request() req, @Param('eventId') eventId: string) {
    return this.eventsService.deleteEvent(eventId, req.user.userId);
  }

  @Post('/logs')
  async createLog(@Request() req, @Body() createLogDto: CreateLogDto) {
    const errors = await validate(createLogDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.eventsService.createLog({
      ...createLogDto,
      userId: req.user.userId,
    });
  }

  @Patch('/logs/:logId')
  async updateLog(
    @Request() req,
    @Body() updateLogDto: UpdateLogDto,
    @Param('logId') logId: string,
  ) {
    const errors = await validate(updateLogDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.eventsService.updateLog(logId, req.user.userId, updateLogDto);
  }

  @Delete('/logs/:logId')
  async deleteLog(@Request() req, @Param('logId') logId: string) {
    return this.eventsService.deleteLog(logId, req.user.userId);
  }
}
