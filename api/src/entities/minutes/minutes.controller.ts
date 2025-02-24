//minutes.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MinutesService } from './minutes.service';
import { Minutes } from './minutes.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('minutes')
export class MinutesController {
  constructor(private readonly minutesService: MinutesService) {}

  @Get()
  async getAllActiveMinutes(): Promise<Minutes[]> {
    return await this.minutesService.getAllMinutes();
  }

  @Get('/data')
  async getlMinutesData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return await this.minutesService.getMinutesData();
  }

  @Get(':id')
  async getMinutesById(@Param('id') id: number): Promise<Minutes | null> {
    return await this.minutesService.getMinutesById(id);
  }

  @Get(':id/members')
  async getMembersByMinutesId(
    @Param('id') id: number,
  ): Promise<Minutes[] | null> {
    return await this.minutesService.getMembersByMinutesId(id);
  }

  @Post()
  async createMinutes(@Body() minute: Minutes): Promise<Minutes> {
    return await this.minutesService.createMinutes(minute);
  }

  @Patch(':id')
  async updateMinutes(
    @Param('id') id: number,
    @Body() minute: Minutes,
  ): Promise<UpdateResult> {
    return await this.minutesService.updateMinutes(id, minute);
  }

  @Delete(':id')
  async deleteMinutes(@Param('id') id: number): Promise<DeleteResult> {
    return await this.minutesService.deleteMinutes(id);
  }
}
