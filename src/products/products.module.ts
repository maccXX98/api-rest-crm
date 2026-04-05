import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { DistributorsModule } from '../distributors/distributors.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductImagesModule } from '../product-images/product-images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    DistributorsModule,
    CategoriesModule,
    ProductImagesModule,
    MulterModule.register({
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [
    TypeOrmModule.forFeature([Product]),
    DistributorsModule,
    CategoriesModule,
    forwardRef(() => ProductImagesModule),
    ProductsService,
  ],
})
export class ProductsModule {}
