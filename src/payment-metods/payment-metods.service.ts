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

  async findByKeywords(words: string[]): Promise<PaymentMethod | null> {
    if (!words.length) return null;
    const methods = await this.paymentMetodsRepository.find();
    for (const method of methods) {
      if (!method.variations) continue;
      const variations = method.variations
        .split(',')
        .map((v) => v.trim().toLowerCase());
      if (words.some((word) => variations.includes(word))) {
        return method;
      }
    }
    return null;
  }
}
