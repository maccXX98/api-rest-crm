import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CUSTOMER_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const newCustomer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(newCustomer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    return this.customerRepository.findOne({ where: { CustomerID: id } });
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { CustomerID: id },
    });
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }

    await this.customerRepository.update(id, updateCustomerDto);
    return this.customerRepository.findOne({ where: { CustomerID: id } });
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.customerRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new Error(`Customer with ID ${id} not found`);
    }
  }
}
