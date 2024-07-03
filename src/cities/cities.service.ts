import { Inject, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CITY_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @Inject(CITY_REPOSITORY)
    private citiesRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const newCity = this.citiesRepository.create(createCityDto);
    return this.citiesRepository.save(newCity);
  }

  async findAll(): Promise<City[]> {
    return this.citiesRepository.find();
  }

  async findOne(id: number): Promise<City> {
    return this.citiesRepository.findOne({
      where: { CityID: id },
    });
  }

  async update(id: number, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.citiesRepository.findOne({
      where: { CityID: id },
    });
    if (!city) {
      throw new Error(`City with ID ${id} not found`);
    }

    await this.citiesRepository.update(id, updateCityDto);
    return this.citiesRepository.findOne({
      where: { CityID: id },
    });
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.citiesRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new Error(`City with ID ${id} not found`);
    }
  }
}
