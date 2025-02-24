//club.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClubService } from './club.service';
import { Club } from './club.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  async getAllActiveClub(): Promise<Club[]> {
    return await this.clubService.getAllClub();
  }

  @Get('/data')
  async getlClubData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return await this.clubService.getClubData();
  }

  @Get(':id')
  async getClubById(@Param('id') id: number): Promise<Club | null> {
    return await this.clubService.getClubById(id);
  }

  @Get(':id/members')
  async getMembersByClubId(@Param('id') id: number): Promise<Club[] | null> {
    return await this.clubService.getMembersByClubId(id);
  }

  @Post()
  async createClub(@Body() expense: Club): Promise<Club> {
    return await this.clubService.createClub(expense);
  }

  @Patch(':id')
  async updateClub(
    @Param('id') id: number,
    @Body() expense: Club,
  ): Promise<UpdateResult> {
    return await this.clubService.updateClub(id, expense);
  }

  @Delete(':id')
  async deleteClub(@Param('id') id: number): Promise<DeleteResult> {
    return await this.clubService.deleteClub(id);
  }
}
