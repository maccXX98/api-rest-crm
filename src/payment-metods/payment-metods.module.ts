import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMetodsService } from './payment-metods.service';
import { PaymentMetodsController } from './payment-metods.controller';
import { PaymentMethod } from './entities/payment-metod.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentMetodsController],
  providers: [PaymentMetodsService],
  exports: [TypeOrmModule.forFeature([PaymentMethod]), PaymentMetodsService],
})
export class PaymentMetodsModule {}
