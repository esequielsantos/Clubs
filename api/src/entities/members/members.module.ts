// members/members.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Members } from './members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Members])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
