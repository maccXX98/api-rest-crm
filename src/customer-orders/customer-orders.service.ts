import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';
import { UpdateCustomerOrderDto } from './dto/update-customer-order.dto';
import { CustomerOrder } from './entities/customer-order.entity';
import { Customer } from '../customers/entities/customer.entity';
import { City } from '../cities/entities/city.entity';
import { PaymentMethod } from '../payment-metods/entities/payment-metod.entity';

@Injectable()
export class CustomerOrdersService {
  constructor(
    @InjectRepository(CustomerOrder)
    private customerOrderRepository: Repository<CustomerOrder>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}
  async create(
    createCustomerOrderDto: CreateCustomerOrderDto,
  ): Promise<CustomerOrder> {
    const { CustomerID, CityID, PaymentMethodID } = createCustomerOrderDto;

    const customer = await this.customerRepository.findOne({
      where: { CustomerID },
    });
    if (!customer) {
      throw new Error('Cliente no encontrado');
    }

    const city = await this.cityRepository.findOne({ where: { CityID } });
    if (!city) {
      throw new Error('Ciudad no encontrada');
    }

    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { PaymentMethodID },
    });
    if (!paymentMethod) {
      throw new Error('Método de pago no encontrado');
    }

    const customerOrder = this.customerOrderRepository.create({
      ...createCustomerOrderDto,
      customer,
      city,
      paymentMethod,
    });

    return this.customerOrderRepository.save(customerOrder);
  }

  async findAll(): Promise<CustomerOrder[]> {
    return this.customerOrderRepository.find({
      relations: ['customer', 'city', 'paymentMethod'],
    });
  }

  async findOne(id: number): Promise<CustomerOrder> {
    const customerOrder = await this.customerOrderRepository.findOne({
      where: { CustomerOrderID: id },
      relations: ['customer', 'city', 'paymentMethod'],
    });
    if (!customerOrder) {
      throw new Error(`Orden de cliente con ID ${id} no encontrada`);
    }
    return customerOrder;
  }

  async update(
    id: number,
    updateCustomerOrderDto: UpdateCustomerOrderDto,
  ): Promise<CustomerOrder> {
    const customerOrder = await this.customerOrderRepository.findOne({
      where: { CustomerOrderID: id },
    });
    if (!customerOrder) {
      throw new Error(`Orden de cliente con ID ${id} no encontrada`);
    }

    const updated = Object.assign(customerOrder, updateCustomerOrderDto);
    return this.customerOrderRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.customerOrderRepository.softDelete(id);
    if (result.affected === 0) {
      throw new Error(`Orden de cliente con ID ${id} no encontrada`);
    }
  }
}
