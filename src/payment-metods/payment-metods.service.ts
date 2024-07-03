import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentMetodDto } from './dto/create-payment-metod.dto';
import { UpdatePaymentMetodDto } from './dto/update-payment-metod.dto';
import { PAYMENT_METHOD_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-metod.entity';

@Injectable()
export class PaymentMetodsService {
  constructor(
    @Inject(PAYMENT_METHOD_REPOSITORY)
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
    return this.paymentMetodsRepository.findOne({
      where: { PaymentMethodID: id },
    });
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
    return this.paymentMetodsRepository.findOne({
      where: { PaymentMethodID: id },
    });
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.paymentMetodsRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new Error(`PaymentMetod with ID ${id} not found`);
    }
  }
}
