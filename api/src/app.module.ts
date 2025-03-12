// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './entities/members/members.module';
import { ManagementModule } from './entities/management/management.module';
import { ProfilesModule } from './entities/profiles/profiles.module';
import { Monthly_feeModule } from './entities/monthly_fee/monthly_fee.module';
import { ormconfig } from 'ormconfig';
import { AddressModule } from './entities/address/address.module';
import { IncomesModule } from './entities/incomes/incomes.module';
import { ClubModule } from './entities/club/club.module';
import { BalanceModule } from './entities/balance/balance.module';
import { ExpensesModule } from './entities/expenses/expenses.module';
import { MeetingsModule } from './entities/meetings/meetings.module';
import { MinutesModule } from './entities/minutes/minutes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    MembersModule,
    ManagementModule,
    ProfilesModule,
    Monthly_feeModule,
    AddressModule,
    IncomesModule,
    ExpensesModule,
    ClubModule,
    BalanceModule,
    MeetingsModule,
    MinutesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
