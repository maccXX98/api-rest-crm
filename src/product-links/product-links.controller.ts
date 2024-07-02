import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductLinksService } from './product-links.service';
import { CreateProductLinkDto } from './dto/create-product-link.dto';
import { UpdateProductLinkDto } from './dto/update-product-link.dto';

@Controller('product-links')
export class ProductLinksController {
  constructor(private readonly productLinksService: ProductLinksService) {}

  @Post()
  create(@Body() createProductLinkDto: CreateProductLinkDto) {
    return this.productLinksService.create(createProductLinkDto);
  }

  @Get()
  findAll() {
    return this.productLinksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productLinksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductLinkDto: UpdateProductLinkDto,
  ) {
    return this.productLinksService.update(+id, updateProductLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productLinksService.remove(+id);
  }
}
