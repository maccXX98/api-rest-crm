import { PartialType } from '@nestjs/mapped-types';
import { CreateProductLinkDto } from './create-product-link.dto';

export class UpdateProductLinkDto extends PartialType(CreateProductLinkDto) {}
