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

  @Get()
  async getAllActiveProfiles(): Promise<Profiles[]> {
    return await this.profilesService.getAllProfiles();
  }

  @Get('/data')
  async getlProfilesData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return await this.profilesService.getProfilesData();
  }

  @Get(':id')
  async getProfileById(@Param('id') id: number): Promise<Profiles | null> {
    return await this.profilesService.getProfileById(id);
  }

  @Get(':id/members')
  async getMembersByProfileId(
    @Param('id') id: number,
  ): Promise<Profiles[] | null> {
    return await this.profilesService.getMembersByProfileId(id);
  }

  @Post()
  async createProfile(@Body() profile: Profiles): Promise<Profiles> {
    return await this.profilesService.createProfile(profile);
  }

  @Patch(':id')
  async updateProfile(
    @Param('id') id: number,
    @Body() profile: Profiles,
  ): Promise<UpdateResult> {
    return await this.profilesService.updateProfile(id, profile);
  }

  @Delete(':id')
  async deleteProfile(@Param('id') id: number): Promise<DeleteResult> {
    return await this.profilesService.deleteProfile(id);
  }
}
