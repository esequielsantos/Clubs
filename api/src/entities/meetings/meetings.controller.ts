//meetings.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { Meetings } from './meetings.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  async getAllActiveMeetings(): Promise<Meetings[]> {
    return await this.meetingsService.getAllMeetings();
  }

  @Get('/data')
  async getlMeetingsData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return await this.meetingsService.getMeetingsData();
  }

  @Get(':id')
  async getMeetingsById(@Param('id') id: number): Promise<Meetings | null> {
    return await this.meetingsService.getMeetingsById(id);
  }

  @Get(':id/members')
  async getMembersByMeetingsId(@Param('id') id: number): Promise<any[] | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.meetingsService.getMembersByMeetingsId(id);
  }

  @Post()
  async createMeetings(@Body() meeting: Meetings): Promise<Meetings> {
    return await this.meetingsService.createMeetings(meeting);
  }

  @Patch(':id')
  async updateMeetings(
    @Param('id') id: number,
    @Body() meeting: Meetings,
  ): Promise<UpdateResult> {
    return await this.meetingsService.updateMeetings(id, meeting);
  }

  @Delete(':id')
  async deleteMeetings(@Param('id') id: number): Promise<DeleteResult> {
    return await this.meetingsService.deleteMeetings(id);
  }
}
