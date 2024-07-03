import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { customerProviders } from './customers.providers';

@Module({
  controllers: [CustomersController],
  providers: [...customerProviders, CustomersService],
  exports: [...customerProviders],
})
export class CustomersModule {}
