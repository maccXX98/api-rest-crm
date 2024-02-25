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

@Module({
  imports: [
    ProductsModule,
    DistributorsModule,
    DatabaseModule,
    ProductOrdersModule,
    ProductOrderDetailsModule,
    UsersModule,
    DistributorRelationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
