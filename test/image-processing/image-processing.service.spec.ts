import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingService } from '../../src/image-processing/image-processing.service';
import { ImageProcessor } from '../../src/image-processing/processors/image.processor';
import { Job } from 'bullmq';
import {
  ImageJobData,
  ImageProcessingResult,
} from '../../src/image-processing/interfaces/image-processing.interface';

describe('ImageProcessingService', () => {
  let service: ImageProcessingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageProcessingService],
    }).compile();

    service = module.get<ImageProcessingService>(ImageProcessingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateImage', () => {
    it('should return invalid for non-image buffer', async () => {
      const buffer = Buffer.from('not an image');
      const result = await service.validateImage(buffer);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid image data');
    });

    it('should return invalid for unsupported format like GIF', async () => {
      // GIF header - GIF is not in the allowed formats list
      const gifBuffer = Buffer.from('GIF89a');
      const result = await service.validateImage(gifBuffer);
      expect(result.valid).toBe(false);
    });
  });

  describe('processProductImage', () => {
    it('should process a valid PNG buffer and generate all versions', async () => {
      // Minimal valid PNG (1x1 transparent pixel)
      const pngBuffer = Buffer.from([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a, // PNG signature
        0x00,
        0x00,
        0x00,
        0x0d,
        0x49,
        0x48,
        0x44,
        0x52, // IHDR chunk
        0x00,
        0x00,
        0x00,
        0x01,
        0x00,
        0x00,
        0x00,
        0x01, // 1x1
        0x08,
        0x06,
        0x00,
        0x00,
        0x00,
        0x1f,
        0x15,
        0xc4, // 8-bit RGBA
        0x89,
        0x00,
        0x00,
        0x00,
        0x0a,
        0x49,
        0x44,
        0x41, // IDAT chunk
        0x54,
        0x78,
        0x9c,
        0x63,
        0x00,
        0x01,
        0x00,
        0x00,
        0x05,
        0x00,
        0x01,
        0x0d,
        0x0a,
        0x2d,
        0xb4,
        0x00,
        0x00,
        0x00,
        0x00,
        0x49,
        0x45,
        0x4e,
        0x44,
        0xae, // IEND chunk
        0x42,
        0x60,
        0x82,
      ]);

      const jobData: ImageJobData = {
        productId: 1,
        productLinkId: undefined,
        fileBuffer: pngBuffer,
        originalFilename: 'test.png',
        mimeType: 'image/png',
        uuid: 'test-uuid-' + Date.now(),
      };

      const result = await service.processProductImage(jobData);

      expect(result).toBeDefined();
      expect(result.originalPath).toContain('originals');
      expect(result.whatsappPath).toContain('whatsapp');
      expect(result.webPath).toContain('web');
      expect(result.thumbPath).toContain('thumbs');
      expect(result.mimeType).toBe('image/png');
      expect(result.originalSize).toBeGreaterThan(0);
    });
  });
});

describe('ImageProcessor', () => {
  let processor: ImageProcessor;
  let mockImageProcessingService: Partial<ImageProcessingService>;

  beforeEach(async () => {
    mockImageProcessingService = {
      validateImage: jest
        .fn()
        .mockResolvedValue({ valid: true, mimeType: 'image/png' }),
      processProductImage: jest.fn().mockResolvedValue({
        originalPath: 'uploads/products/originals/test.png',
        whatsappPath: 'uploads/products/whatsapp/test.jpg',
        webPath: 'uploads/products/web/test.webp',
        thumbPath: 'uploads/products/thumbs/test.webp',
        mimeType: 'image/png',
        originalSize: 1000,
        processedAt: new Date(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageProcessor,
        {
          provide: ImageProcessingService,
          useValue: mockImageProcessingService,
        },
      ],
    }).compile();

    processor = module.get<ImageProcessor>(ImageProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should process valid image job', async () => {
      const jobData: ImageJobData = {
        productId: 1,
        productLinkId: undefined,
        fileBuffer: Buffer.from('fake image data'),
        originalFilename: 'test.png',
        mimeType: 'image/png',
        uuid: 'test-uuid',
      };

      const mockJob = {
        id: 'job-1',
        name: 'process-product-image',
        data: jobData,
        updateProgress: jest.fn(),
      } as unknown as Job<ImageJobData, ImageProcessingResult, string>;

      const result = await processor.process(mockJob);

      expect(result).toBeDefined();
      expect(result.whatsappPath).toContain('whatsapp');
      expect(result.webPath).toContain('web');
      expect(result.thumbPath).toContain('thumbs');
      expect(mockImageProcessingService.validateImage).toHaveBeenCalledWith(
        jobData.fileBuffer,
      );
    });

    it('should throw error for invalid image', async () => {
      mockImageProcessingService.validateImage = jest.fn().mockResolvedValue({
        valid: false,
        mimeType: '',
        error: 'Invalid image format',
      });

      const jobData: ImageJobData = {
        fileBuffer: Buffer.from('not image'),
        originalFilename: 'invalid.gif',
        mimeType: 'image/gif',
        uuid: 'test-uuid',
      };

      const mockJob = {
        id: 'job-1',
        name: 'process-product-image',
        data: jobData,
        updateProgress: jest.fn(),
      } as unknown as Job<ImageJobData, ImageProcessingResult, string>;

      await expect(processor.process(mockJob)).rejects.toThrow(
        'Invalid image: Invalid image format',
      );
    });

    it('should update progress during processing', async () => {
      const jobData: ImageJobData = {
        fileBuffer: Buffer.from('test'),
        originalFilename: 'test.png',
        mimeType: 'image/png',
        uuid: 'test-uuid',
      };

      const mockJob = {
        id: 'job-1',
        name: 'process-product-image',
        data: jobData,
        updateProgress: jest.fn(),
      } as unknown as Job<ImageJobData, ImageProcessingResult, string>;

      await processor.process(mockJob);

      // Verify progress was updated
      expect(mockJob.updateProgress).toHaveBeenCalledWith(10); // After validation
      expect(mockJob.updateProgress).toHaveBeenCalledWith(20); // After starting processing
      expect(mockJob.updateProgress).toHaveBeenCalledWith(100); // After completion
    });
  });
});
