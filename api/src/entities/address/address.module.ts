// address/address.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { City } from './city.entity';
import { State } from './state.entity';
import { Country } from './country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, City, State, Country])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
