import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentMetodDto } from './dto/create-payment-metod.dto';
import { UpdatePaymentMetodDto } from './dto/update-payment-metod.dto';
import { PaymentMethod } from './entities/payment-metod.entity';

@Injectable()
export class PaymentMetodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMetodsRepository: Repository<PaymentMethod>,
  ) {}

  async create(
    createPaymentMetodDto: CreatePaymentMetodDto,
  ): Promise<PaymentMethod> {
    const newPaymentMetod = this.paymentMetodsRepository.create(
      createPaymentMetodDto,
    );
    return this.paymentMetodsRepository.save(newPaymentMetod);
  }

  async findAll(): Promise<PaymentMethod[]> {
    return this.paymentMetodsRepository.find();
  }

  async findOne(id: number): Promise<PaymentMethod> {
    const method = await this.paymentMetodsRepository.findOne({
      where: { PaymentMethodID: id },
    });
    if (!method) throw new Error(`PaymentMethod with ID ${id} not found`);
    return method;
  }

  async update(
    id: number,
    updatePaymentMetodDto: UpdatePaymentMetodDto,
  ): Promise<PaymentMethod> {
    const paymentMetod = await this.paymentMetodsRepository.findOne({
      where: { PaymentMethodID: id },
    });
    if (!paymentMetod) {
      throw new Error(`PaymentMetod with ID ${id} not found`);
    }

    await this.paymentMetodsRepository.update(id, updatePaymentMetodDto);
    const updatedMethod = await this.paymentMetodsRepository.findOne({
      where: { PaymentMethodID: id },
    });
    if (!updatedMethod)
      throw new Error(`PaymentMethod with ID ${id} not found`);
    return updatedMethod;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.paymentMetodsRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new Error(`PaymentMetod with ID ${id} not found`);
    }
  }
}
