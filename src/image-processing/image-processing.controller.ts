import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ImageQueueService } from './image-queue.service';
import { Public } from './public.decorator';

// Constants
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

@Controller('upload')
export class ImageProcessingController {
  private readonly logger = new Logger(ImageProcessingController.name);

  constructor(private readonly imageQueueService: ImageQueueService) {}

  @Public()
  @Post('product-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'products', 'originals'),
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only PNG, JPG, JPEG and WebP images are allowed',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadProductImage(@UploadedFile() file: Request['file']) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.log(`File uploaded: ${file.filename}`);

    // Read file buffer for queue processing
    const fs = await import('fs/promises');
    const fileBuffer = await fs.readFile(file.path);

    // Add job to queue
    const job = await this.imageQueueService.addImageProcessingJob({
      productId: undefined,
      productLinkId: undefined,
      fileBuffer,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      uuid: file.filename.replace(extname(file.filename), ''),
    });

    return {
      jobId: job.id,
      status: 'queued',
      message: 'Image processing started',
      filename: file.filename,
    };
  }

  @Public()
  @Get('product-image/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    const result = await this.imageQueueService.getJobStatus(jobId);

    if (!result) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    return result;
  }
}
