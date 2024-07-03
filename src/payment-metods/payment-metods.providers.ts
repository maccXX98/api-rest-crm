import { DataSource } from 'typeorm';
import { PaymentMetod } from './entities/payment-metod.entity';
import { DATA_SOURCE, PAYMENT_METOD_REPOSITORY } from '../constants';

export const paymentMetodsProviders = [
  {
    provide: PAYMENT_METOD_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PaymentMetod),
    inject: [DATA_SOURCE],
  },
];
