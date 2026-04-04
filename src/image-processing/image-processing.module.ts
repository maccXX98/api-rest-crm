import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MulterModule } from '@nestjs/platform-express';
import { ImageProcessingService } from './image-processing.service';
import { ImageProcessingController } from './image-processing.controller';
import { ImageQueueService } from './image-queue.service';
import {
  ImageProcessor,
  IMAGE_PROCESSING_QUEUE,
} from './processors/image.processor';
import { ProductImagesModule } from '../product-images/product-images.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: null,
      },
    }),
    BullModule.registerQueue({
      name: IMAGE_PROCESSING_QUEUE,
    }),
    MulterModule.register({
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
    }),
    ProductImagesModule,
  ],
  controllers: [ImageProcessingController],
  providers: [ImageProcessingService, ImageQueueService, ImageProcessor],
  exports: [ImageProcessingService, ImageQueueService],
})
export class ImageProcessingModule {}
