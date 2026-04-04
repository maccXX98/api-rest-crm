import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessImageDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productLinkId?: number;
}
