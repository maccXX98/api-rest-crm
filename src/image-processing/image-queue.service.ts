import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import {
  ImageJobData,
  ImageProcessingResult,
  JobProgress,
} from './interfaces/image-processing.interface';
import { IMAGE_PROCESSING_QUEUE } from './processors/image.processor';

@Injectable()
export class ImageQueueService {
  private readonly logger = new Logger(ImageQueueService.name);

  constructor(
    @InjectQueue(IMAGE_PROCESSING_QUEUE)
    private readonly imageQueue: Queue<
      ImageJobData,
      ImageProcessingResult,
      string
    >,
  ) {}

  async addImageProcessingJob(
    data: ImageJobData,
  ): Promise<Job<ImageJobData, ImageProcessingResult, string>> {
    const job = await this.imageQueue.add('process-product-image', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: {
        count: 100,
      },
      removeOnFail: {
        count: 500,
      },
    });

    this.logger.log(
      `Job ${job.id} added to queue for ${data.originalFilename}`,
    );
    return job;
  }

  async getJobStatus(jobId: string): Promise<JobProgress | null> {
    const job = await this.imageQueue.getJob(jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = typeof job.progress === 'number' ? job.progress : 0;

    const result: JobProgress = {
      jobId: job.id || jobId,
      status: this.mapStateToStatus(state),
      progress,
    };

    // If completed, get the result
    if (state === 'completed') {
      const jobResult = await job.returnvalue;
      if (jobResult) {
        result.result = jobResult as ImageProcessingResult;
      }
    }

    // If failed, get the error
    if (state === 'failed') {
      const failedReason = job.failedReason;
      result.error = failedReason || 'Unknown error';
    }

    return result;
  }

  private mapStateToStatus(
    state: string,
  ): 'pending' | 'processing' | 'completed' | 'failed' {
    switch (state) {
      case 'waiting':
      case 'delayed':
        return 'pending';
      case 'active':
        return 'processing';
      case 'completed':
        return 'completed';
      case 'failed':
        return 'failed';
      default:
        return 'pending';
    }
  }
}
