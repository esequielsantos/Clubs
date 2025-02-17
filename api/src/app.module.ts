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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'club.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MembersModule,
    ManagementModule,
    ProfilesModule,
    Monthly_feeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
