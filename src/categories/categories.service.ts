import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CATEGORY_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['products'],
      withDeleted: false,
    });
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { CategoryID: id },
      relations: ['products'],
    });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { CategoryID: id },
    });
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.update({ CategoryID: id }, updateCategoryDto);
    return this.categoryRepository.findOne({
      where: { CategoryID: id },
      relations: ['products'],
    });
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.categoryRepository.softDelete({
      CategoryID: id,
    });
    if (!deleteResult.affected) {
      throw new Error(`Category with ID ${id} not found`);
    }
  }
}
