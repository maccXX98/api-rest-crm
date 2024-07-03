import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentMetodDto } from './dto/create-payment-metod.dto';
import { UpdatePaymentMetodDto } from './dto/update-payment-metod.dto';
import { PAYMENT_METOD_REPOSITORY } from '../constants';
import { Repository } from 'typeorm';
import { PaymentMetod } from './entities/payment-metod.entity';

@Injectable()
export class PaymentMetodsService {
  constructor(
    @Inject(PAYMENT_METOD_REPOSITORY)
    private paymentMetodsRepository: Repository<PaymentMetod>,
  ) {}

  async create(
    createPaymentMetodDto: CreatePaymentMetodDto,
  ): Promise<PaymentMetod> {
    const newPaymentMetod = this.paymentMetodsRepository.create(
      createPaymentMetodDto,
    );
    return this.paymentMetodsRepository.save(newPaymentMetod);
  }

  async findAll(): Promise<PaymentMetod[]> {
    return this.paymentMetodsRepository.find();
  }

  async findOne(id: number): Promise<PaymentMetod> {
    return this.paymentMetodsRepository.findOne({
      where: { PaymentMetodID: id },
    });
  }

  async update(
    id: number,
    updatePaymentMetodDto: UpdatePaymentMetodDto,
  ): Promise<PaymentMetod> {
    const paymentMetod = await this.paymentMetodsRepository.findOne({
      where: { PaymentMetodID: id },
    });
    if (!paymentMetod) {
      throw new Error(`PaymentMetod with ID ${id} not found`);
    }

    await this.paymentMetodsRepository.update(id, updatePaymentMetodDto);
    return this.paymentMetodsRepository.findOne({
      where: { PaymentMetodID: id },
    });
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.paymentMetodsRepository.softDelete(id);
    if (!deleteResult.affected) {
      throw new Error(`PaymentMetod with ID ${id} not found`);
    }
  }
}
