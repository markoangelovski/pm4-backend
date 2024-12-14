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
} from '@nestjs/common';
import { validate } from 'class-validator';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getEvents() {
    return this.eventsService.getEvents();
  }

  @Post()
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

  @Patch(':eventId')
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

  @Delete(':eventId')
  async deleteEvent(@Request() req, @Param('eventId') eventId: string) {
    return this.eventsService.deleteEvent(eventId, req.user.userId);
  }
}
