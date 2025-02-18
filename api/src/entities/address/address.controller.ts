//address.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './address.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async getAllActiveAddress(): Promise<Address[]> {
    return await this.addressService.getAllAddress();
  }

  @Get(':id')
  async getAddressById(@Param('id') id: number): Promise<Address | null> {
    return await this.addressService.getAddressById(id);
  }

  /* @Get(':id/members')
  async getMembersByAddressId(
    @Param('id') id: number,
  ): Promise<Address[] | null> {
    return await this.addressService.getMembersByAddressId(id);
  } */

  @Post()
  async createAddress(@Body() address: Address): Promise<Address> {
    return await this.addressService.createAddress(address);
  }
  @Post('/country')
  async createCountryAddress(@Body() country: Country): Promise<Country> {
    return await this.addressService.createCountryAddress(country);
  }
  @Post('/state')
  async createStateAddress(@Body() state: State): Promise<State> {
    return await this.addressService.createStateAddress(state);
  }
  @Post('/city')
  async createCityAddress(@Body() city: City): Promise<City> {
    return await this.addressService.createCityAddress(city);
  }

  @Patch(':id')
  async updateAddress(
    @Param('id') id: number,
    @Body() address: Address,
  ): Promise<UpdateResult> {
    return await this.addressService.updateAddress(id, address);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: number): Promise<DeleteResult> {
    return await this.addressService.deleteAddress(id);
  }
}
