import { Module } from '@nestjs/common';
import { PaymentMetodsService } from './payment-metods.service';
import { PaymentMetodsController } from './payment-metods.controller';
import { paymentMetodsProviders } from './payment-metods.providers';

@Module({
  controllers: [PaymentMetodsController],
  providers: [...paymentMetodsProviders, PaymentMetodsService],
  exports: [...paymentMetodsProviders],
})
export class PaymentMetodsModule {}
