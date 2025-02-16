//profiles.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profiles } from './profiles.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/all')
  async getAllProfiles(): Promise<Profiles[]> {
    return await this.profilesService.getAllProfiles();
  }

  @Get()
  async getAllActiveProfiles(): Promise<Profiles[]> {
    return await this.profilesService.getAllActiveProfiles();
  }

  @Get(':id')
  async getMemberById(@Param('id') id: number): Promise<Profiles | null> {
    return await this.profilesService.getMemberById(id);
  }

  @Post()
  async createMember(@Body() member: Profiles): Promise<Profiles> {
    return await this.profilesService.createMember(member);
  }

  @Patch(':id')
  async updateMember(
    @Param('id') id: number,
    @Body() member: Profiles,
  ): Promise<UpdateResult> {
    return await this.profilesService.updateMember(id, member);
  }

  @Delete(':id')
  async deleteMember(@Param('id') id: number): Promise<DeleteResult> {
    return await this.profilesService.deleteMember(id);
  }
}
