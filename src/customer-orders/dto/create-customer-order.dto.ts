import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerOrderDto {
  @IsNotEmpty()
  CustomerID: number;

  @IsNotEmpty()
  CityID: number;

  @IsOptional()
  PaymentMethodID?: number | null;
}
