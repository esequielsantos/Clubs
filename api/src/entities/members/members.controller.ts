//members.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { Members } from './members.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('/all')
  async getAllMembers(): Promise<Members[]> {
    return await this.membersService.getAllMembers();
  }

  @Get('/data')
  async getlMembersData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return await this.membersService.getMembersData();
  }

  @Get()
  async getAllActiveMembers(): Promise<Members[]> {
    return await this.membersService.getAllActiveMembers();
  }

  @Get('/full/:id')
  async getFullMemberById(@Param('id') id: number): Promise<Members | null> {
    return await this.membersService.getFullMemberById(id);
  }

  @Get(':id')
  async getMemberById(@Param('id') id: number): Promise<Members | null> {
    return await this.membersService.getMemberById(id);
  }

  @Post()
  async createMember(@Body() member: Members): Promise<Members> {
    return await this.membersService.createMember(member);
  }

  @Patch(':id')
  async updateMember(
    @Param('id') id: number,
    @Body() member: Members,
  ): Promise<UpdateResult> {
    return await this.membersService.updateMember(id, member);
  }

  @Delete(':id')
  async deleteMember(@Param('id') id: number): Promise<DeleteResult> {
    return await this.membersService.deleteMember(id);
  }
}
