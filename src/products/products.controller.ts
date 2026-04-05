import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Constants
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  // =========================================
  // Image Endpoints
  // =========================================

  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only PNG, JPG, JPEG and WebP images are allowed',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadProductImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Request['file'],
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const productImage = await this.productsService.addProductImage(
      id,
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    return {
      message: 'Image uploaded and processed successfully',
      image: productImage,
    };
  }

  @Get(':id/images')
  async getProductImages(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProductImages(id);
  }

  @Delete(':id/images/:imageId')
  async deleteProductImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    await this.productsService.deleteProductImage(id, imageId);
    return { message: 'Image deleted successfully' };
  }
}
