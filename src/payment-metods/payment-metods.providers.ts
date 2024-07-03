import { DataSource } from 'typeorm';
import { PaymentMethod } from './entities/payment-metod.entity';
import { DATA_SOURCE, PAYMENT_METHOD_REPOSITORY } from '../constants';

export const paymentMetodsProviders = [
  {
    provide: PAYMENT_METHOD_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PaymentMethod),
    inject: [DATA_SOURCE],
  },
];
