import { IsNotEmpty } from 'class-validator';

export class CreateCustomerOrderDto {
  @IsNotEmpty()
  CustomerID: number;

  @IsNotEmpty()
  CityID: number;

  @IsNotEmpty()
  PaymentMethodID: number;
}
