import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
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
    const customer = await this.customerRepository.findOne({
      where: { CustomerID: id },
    });
    if (!customer) throw new Error(`Customer with ID ${id} not found`);
    return customer;
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
    const updatedCustomer = await this.customerRepository.findOne({
      where: { CustomerID: id },
    });
    if (!updatedCustomer) throw new Error(`Customer with ID ${id} not found`);
    return updatedCustomer;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.customerRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new Error(`Customer with ID ${id} not found`);
    }
  }

  async getOrCreateByPhone(phone: string): Promise<Customer> {
    let customer = await this.customerRepository.findOne({ where: { phone } });
    if (!customer) {
      customer = this.customerRepository.create({
        phone,
        name: 'Cliente WhatsApp',
      });
      customer = await this.customerRepository.save(customer);
    }
    return customer;
  }
}
