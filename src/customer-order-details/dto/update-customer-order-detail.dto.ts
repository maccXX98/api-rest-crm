import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerOrderDetailDto } from './create-customer-order-detail.dto';

export class UpdateCustomerOrderDetailDto extends PartialType(CreateCustomerOrderDetailDto) {}
