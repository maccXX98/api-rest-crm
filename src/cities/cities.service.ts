import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
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
    const city = await this.citiesRepository.findOne({
      where: { CityID: id },
    });
    if (!city) throw new Error(`City with ID ${id} not found`);
    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.citiesRepository.findOne({
      where: { CityID: id },
    });
    if (!city) {
      throw new Error(`City with ID ${id} not found`);
    }

    await this.citiesRepository.update(id, updateCityDto);
    const updatedCity = await this.citiesRepository.findOne({
      where: { CityID: id },
    });
    if (!updatedCity) throw new Error(`City with ID ${id} not found`);
    return updatedCity;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.citiesRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new Error(`City with ID ${id} not found`);
    }
  }

  async findByKeywords(words: string[]): Promise<City | null> {
    if (!words.length) return null;
    const cities = await this.citiesRepository.find();
    for (const city of cities) {
      if (!city.variations) continue;
      const variations = city.variations
        .split(',')
        .map((v) => v.trim().toLowerCase());
      if (words.some((word) => variations.includes(word))) {
        return city;
      }
    }
    return null;
  }
}
