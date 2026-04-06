import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import { CityVariation } from './entities/city-variation.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @InjectRepository(CityVariation)
    private cityVariationRepository: Repository<CityVariation>,
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

  /**
   * Find city by keywords using the city_variation table
   * This is the proper normalized approach instead of comma-separated values
   */
  async findByKeywords(words: string[]): Promise<City | null> {
    if (!words.length) return null;

    // Normalize words to lowercase
    const normalizedWords = words.map((w) => w.toLowerCase().trim());

    // Find a variation that matches any of the keywords
    const variation = await this.cityVariationRepository
      .createQueryBuilder('cv')
      .innerJoinAndSelect('cv.city', 'city')
      .where('LOWER(cv.variation) IN (:...words)', {
        words: normalizedWords,
      })
      .getOne();

    return variation?.city ?? null;
  }

  /**
   * Add a variation to a city (for managing city variations)
   */
  async addVariation(
    cityId: number,
    variation: string,
  ): Promise<CityVariation> {
    const cityVariation = this.cityVariationRepository.create({
      cityId,
      variation: variation.toLowerCase().trim(),
    });
    return this.cityVariationRepository.save(cityVariation);
  }

  /**
   * Remove a variation from a city
   */
  async removeVariation(variationId: number): Promise<void> {
    await this.cityVariationRepository.delete(variationId);
  }
}
