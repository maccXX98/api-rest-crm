import { PartialType } from '@nestjs/mapped-types';
import { CreateProductOrderDetailDto } from './create-product-order-detail.dto';

export class UpdateProductOrderDetailDto extends PartialType(
  CreateProductOrderDetailDto,
) {}
