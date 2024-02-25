import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductOrderDetailsService } from './product-order-details.service';
import { CreateProductOrderDetailDto } from './dto/create-product-order-detail.dto';
import { UpdateProductOrderDetailDto } from './dto/update-product-order-detail.dto';

@Controller('product-order-details')
export class ProductOrderDetailsController {
  constructor(
    private readonly productOrderDetailsService: ProductOrderDetailsService,
  ) {}

  @Post()
  create(@Body() createProductOrderDetailDto: CreateProductOrderDetailDto) {
    return this.productOrderDetailsService.create(createProductOrderDetailDto);
  }

  @Get()
  findAll() {
    return this.productOrderDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOrderDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductOrderDetailDto: UpdateProductOrderDetailDto,
  ) {
    return this.productOrderDetailsService.update(
      +id,
      updateProductOrderDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOrderDetailsService.remove(+id);
  }
}
