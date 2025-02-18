//address.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async createAddress(address: Address): Promise<Address> {
    return await this.addressRepository.save(address);
  }
  async createCountryAddress(country: Country): Promise<Country> {
    return await this.countryRepository.save(country);
  }
  async createStateAddress(state: State): Promise<State> {
    return await this.stateRepository.save(state);
  }
  async createCityAddress(city: City): Promise<City> {
    return await this.cityRepository.save(city);
  }

  async getAllAddress(): Promise<Address[]> {
    return await this.addressRepository.find({
      relations: ['city', 'city.state', 'city.state.country'],
    });
  }

  /* async getMembersByAddressId(id: number): Promise<Address[]> {
    return await this.addressRepository
      .createQueryBuilder('address')
      .innerJoinAndSelect('address.membersOf', 'membersOf')
      .where('address.id = :id', { id })
      .select(['membersOf.*', 'address.name', 'address.description'])
      .getRawMany();
  } */

  async getAddressById(id: number): Promise<Address | null> {
    return await this.addressRepository.findOneById(id);
  }

  async updateAddress(id: number, address: Address): Promise<UpdateResult> {
    return await this.addressRepository.update(id, address);
  }

  async deleteAddress(id: number): Promise<DeleteResult> {
    return await this.addressRepository.delete(id);
  }
}
