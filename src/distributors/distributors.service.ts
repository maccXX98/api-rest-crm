import { Inject, Injectable } from '@nestjs/common';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { UpdateDistributorDto } from './dto/update-distributor.dto';
import { DISTRIBUTOR_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { Distributor } from './entities/distributor.entity';

@Injectable()
export class DistributorsService {
  constructor(
    @Inject(DISTRIBUTOR_REPOSITORY)
    private distributorRepository: Repository<Distributor>,
  ) {}

  async create(
    createDistributorDto: CreateDistributorDto,
  ): Promise<Distributor> {
    const newDistributor =
      this.distributorRepository.create(createDistributorDto);
    return this.distributorRepository.save(newDistributor);
  }

  async findAll(): Promise<Distributor[]> {
    return this.distributorRepository.find({ withDeleted: false });
  }

  async findOne(id: number): Promise<Distributor> {
    return this.distributorRepository.findOne({ where: { DistributorID: id } });
  }

  async update(
    id: number,
    updateDistributorDto: UpdateDistributorDto,
  ): Promise<Distributor> {
    await this.distributorRepository.update(
      { DistributorID: id },
      updateDistributorDto,
    );
    const updatedDistributor = await this.distributorRepository.findOne({
      where: { DistributorID: id },
    });
    if (!updatedDistributor) {
      throw new Error(`Distributor with ID ${id} not found`);
    }
    return updatedDistributor;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.distributorRepository.softDelete({
      DistributorID: id,
    });
    if (!deleteResult.affected) {
      throw new Error(`Distributor with ID ${id} not found`);
    }
  }
}
