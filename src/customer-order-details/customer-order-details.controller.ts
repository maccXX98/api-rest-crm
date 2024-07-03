import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerOrderDetailsService } from './customer-order-details.service';
import { CreateCustomerOrderDetailDto } from './dto/create-customer-order-detail.dto';
import { UpdateCustomerOrderDetailDto } from './dto/update-customer-order-detail.dto';

@Controller('customer-order-details')
export class CustomerOrderDetailsController {
  constructor(
    private readonly customerOrderDetailsService: CustomerOrderDetailsService,
  ) {}

  @Post()
  create(@Body() createCustomerOrderDetailDto: CreateCustomerOrderDetailDto) {
    return this.customerOrderDetailsService.create(
      createCustomerOrderDetailDto,
    );
  }

  @Get()
  findAll() {
    return this.customerOrderDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerOrderDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerOrderDetailDto: UpdateCustomerOrderDetailDto,
  ) {
    return this.customerOrderDetailsService.update(
      +id,
      updateCustomerOrderDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerOrderDetailsService.remove(+id);
  }
}
