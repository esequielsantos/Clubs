//management.controller
import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ManagementService } from './management.service';
import { Management } from './management.entity';
import { UpdateResult } from 'typeorm';
import { Members } from '../members/members.entity';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('/all')
  async getAllManagement(): Promise<Management[] | null> {
    return await this.managementService.getAllManagement();
  }

  @Get('/president')
  async getMembersPresident(): Promise<any> {
    return await this.managementService.getMembersPresident();
  }

  @Get('/president/:year')
  async getMembersPresidentInYear(@Param('year') year: number): Promise<any> {
    return await this.managementService.getMembersPresidentInYear(year);
  }
  @Get('/secretary')
  async getMembersSecretary(): Promise<Members[] | null> {
    return await this.managementService.getMembersSecretary();
  }

  @Get()
  async getAllActiveManagement(): Promise<Management[]> {
    return await this.managementService.getAllActiveManagement();
  }

  @Get(':id')
  async getManagementById(@Param('id') id: number): Promise<Management | null> {
    return await this.managementService.getManagementById(id);
  }

  @Post()
  async createMember(@Body() management: Management): Promise<Management> {
    return await this.managementService.createManagement(management);
  }

  @Patch(':id')
  async updateMember(
    @Param('id') id: number,
    @Body() management: Management,
  ): Promise<UpdateResult> {
    return await this.managementService.updateManagement(id, management);
  }
}
