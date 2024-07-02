import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { DistributorsModule } from './distributors/distributors.module';
import { DatabaseModule } from './database/database.module';
import { ProductOrdersModule } from './product-orders/product-orders.module';
import { UsersModule } from './users/users.module';
import { ProductOrderDetailsModule } from './product-order-details/product-order-details.module';
import { DistributorRelationsModule } from './distributor-relations/distributor-relations.module';
import { PricesModule } from './prices/prices.module';
import { CategoriesModule } from './categories/categories.module';
import { InventoriesModule } from './inventories/inventories.module';
import { ProductLinksModule } from './product-links/product-links.module';

@Module({
  imports: [
    ProductsModule,
    DistributorsModule,
    DatabaseModule,
    ProductOrdersModule,
    ProductOrderDetailsModule,
    UsersModule,
    DistributorRelationsModule,
    PricesModule,
    CategoriesModule,
    InventoriesModule,
    ProductLinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
