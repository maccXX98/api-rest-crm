import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ProductImagesService } from './product-images.service';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
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
  async uploadImage(@UploadedFile() file: Request['file']) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const productImage =
      await this.productImagesService.processAndCreateProductImage(
        file.buffer,
        file.originalname,
        file.mimetype,
        {},
      );

    return {
      message: 'Image uploaded and processed successfully',
      image: productImage,
    };
  }

  @Get('product/:productId')
  async getImagesByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.productImagesService.getProductImageUrls(productId);
  }

  @Get(':id')
  async getImage(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.findById(id);
  }

  @Delete(':id')
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    await this.productImagesService.delete(id);
    return { message: 'Image deleted successfully' };
  }
}
