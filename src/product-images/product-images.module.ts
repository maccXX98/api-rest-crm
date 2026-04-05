import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { ProductImage } from './entities/product-image.entity';
import { ImageProcessingModule } from '../image-processing/image-processing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]),
    forwardRef(() => ImageProcessingModule),
  ],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
  exports: [TypeOrmModule.forFeature([ProductImage]), ProductImagesService],
})
export class ProductImagesModule {}
