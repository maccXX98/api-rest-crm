import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentMetodsService } from './payment-metods.service';
import { CreatePaymentMetodDto } from './dto/create-payment-metod.dto';
import { UpdatePaymentMetodDto } from './dto/update-payment-metod.dto';

@Controller('payment-metods')
export class PaymentMetodsController {
  constructor(private readonly paymentMetodsService: PaymentMetodsService) {}

  @Post()
  create(@Body() createPaymentMetodDto: CreatePaymentMetodDto) {
    return this.paymentMetodsService.create(createPaymentMetodDto);
  }

  @Get()
  findAll() {
    return this.paymentMetodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMetodsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMetodDto: UpdatePaymentMetodDto,
  ) {
    return this.paymentMetodsService.update(+id, updatePaymentMetodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMetodsService.remove(+id);
  }
}
