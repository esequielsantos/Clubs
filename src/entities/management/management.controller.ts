//management.controller
import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ManagementService } from './management.service';
import { Management } from './management.entity';
import { UpdateResult } from 'typeorm';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('/all')
  async getAllManagement(): Promise<Management[]> {
    return await this.managementService.getAllManagement();
  }

  @Get()
  async getAllActiveManagement(): Promise<Management[]> {
    return await this.managementService.getAllActiveManagement();
  }

  @Get(':id')
  async getManagementById(@Param('id') id: number): Promise<Management | null> {
    return await this.managementService.getManagementById(id);
  }

  @Get('/president')
  async getMembersPresident(): Promise<Management[] | null> {
    return await this.managementService.getMembersPresident();
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
