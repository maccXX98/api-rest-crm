import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentMetodDto } from './create-payment-metod.dto';

export class UpdatePaymentMetodDto extends PartialType(CreatePaymentMetodDto) {}
