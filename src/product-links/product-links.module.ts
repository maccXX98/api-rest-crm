import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLinksService } from './product-links.service';
import { ProductLinksController } from './product-links.controller';
import { ProductLink } from './entities/product-link.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductLink]), ProductsModule],
  controllers: [ProductLinksController],
  providers: [ProductLinksService],
  exports: [TypeOrmModule.forFeature([ProductLink]), ProductLinksService],
})
export class ProductLinksModule {}
