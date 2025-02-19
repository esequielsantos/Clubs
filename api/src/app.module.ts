// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(ormconfig),
    MembersModule,
    ManagementModule,
    ProfilesModule,
    Monthly_feeModule,
    AddressModule,
    IncomesModule,
    ClubModule,
    BalanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
