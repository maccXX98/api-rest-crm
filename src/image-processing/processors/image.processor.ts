import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ImageProcessingService } from '../image-processing.service';
import {
  ImageJobData,
  ImageProcessingResult,
} from '../interfaces/image-processing.interface';

export const IMAGE_PROCESSING_QUEUE = 'image-processing';

@Processor(IMAGE_PROCESSING_QUEUE)
export class ImageProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageProcessor.name);

  constructor(private readonly imageProcessingService: ImageProcessingService) {
    super();
  }

  async process(
    job: Job<ImageJobData, ImageProcessingResult, string>,
  ): Promise<ImageProcessingResult> {
    this.logger.log(`Processing job ${job.id} - ${job.name}`);

    try {
      await job.updateProgress(10);

      // Validate image before processing
      const validation = await this.imageProcessingService.validateImage(
        job.data.fileBuffer,
      );
      if (!validation.valid) {
        throw new Error(`Invalid image: ${validation.error}`);
      }

      await job.updateProgress(20);

      // Process the image
      const result = await this.imageProcessingService.processProductImage(
        job.data,
      );

      await job.updateProgress(100);

      this.logger.log(`Job ${job.id} completed successfully`);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Job ${job.id} failed: ${errorMessage}`);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ImageJobData, ImageProcessingResult, string>) {
    this.logger.log(`Job ${job.id} completed for ${job.data.originalFilename}`);
  }

  @OnWorkerEvent('failed')
  onFailed(
    job: Job<ImageJobData, ImageProcessingResult, string>,
    error: Error,
  ) {
    this.logger.error(
      `Job ${job.id} failed for ${job.data.originalFilename}: ${error.message}`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job<ImageJobData, ImageProcessingResult, string>) {
    this.logger.debug(`Job ${job.id} progress: ${job.progress}%`);
  }
}
