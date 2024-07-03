import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerOrdersService } from './customer-orders.service';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';
import { UpdateCustomerOrderDto } from './dto/update-customer-order.dto';

@Controller('customer-orders')
export class CustomerOrdersController {
  constructor(private readonly customerOrdersService: CustomerOrdersService) {}

  @Post()
  create(@Body() createCustomerOrderDto: CreateCustomerOrderDto) {
    return this.customerOrdersService.create(createCustomerOrderDto);
  }

  @Get()
  findAll() {
    return this.customerOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerOrderDto: UpdateCustomerOrderDto,
  ) {
    return this.customerOrdersService.update(+id, updateCustomerOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerOrdersService.remove(+id);
  }
}
