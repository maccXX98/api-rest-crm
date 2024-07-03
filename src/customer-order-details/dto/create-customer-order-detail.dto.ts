import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCustomerOrderDetailDto {
  @IsNotEmpty()
  CustomerOrderID: number;

  @IsNotEmpty()
  ProductID: number;

  @IsNotEmpty()
  @IsInt()
  Quantity: number;
}
