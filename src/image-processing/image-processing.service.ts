import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import {
  ImageProcessingResult,
  ImageJobData,
} from './interfaces/image-processing.interface';

// Configuration
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'products');
const WHATSAPP_DIR = path.join(UPLOADS_DIR, 'whatsapp');
const WEB_DIR = path.join(UPLOADS_DIR, 'web');
const THUMBS_DIR = path.join(UPLOADS_DIR, 'thumbs');
const ORIGINALS_DIR = path.join(UPLOADS_DIR, 'originals');

// Sharp configuration constants
const WHATSAPP_WIDTH = 800;
const WEB_WIDTH = 400;
const THUMB_SIZE = 150;
const WHATSAPP_QUALITY = 80;
const WEB_QUALITY = 75;
const THUMB_QUALITY = 70;

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);

  constructor() {
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    const dirs = [
      UPLOADS_DIR,
      WHATSAPP_DIR,
      WEB_DIR,
      THUMBS_DIR,
      ORIGINALS_DIR,
    ];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created directory: ${dir}`);
      }
    }
  }

  async processProductImage(
    data: ImageJobData,
  ): Promise<ImageProcessingResult> {
    const { uuid, fileBuffer, originalFilename, mimeType } = data;

    this.logger.log(`Processing image: ${originalFilename} (${uuid})`);

    // Determine output extension based on format
    const ext = this.getExtensionFromMime(mimeType);
    const baseName = `${uuid}`;

    // Paths
    const originalPath = path.join(ORIGINALS_DIR, `${baseName}${ext}`);
    const whatsappPath = path.join(WHATSAPP_DIR, `${baseName}.jpg`);
    const webPath = path.join(WEB_DIR, `${baseName}.webp`);
    const thumbPath = path.join(THUMBS_DIR, `${baseName}.webp`);

    // 1. Save original
    await fs.promises.writeFile(originalPath, fileBuffer);
    this.logger.debug(`Saved original: ${originalPath}`);

    // 2. Generate WhatsApp version (JPEG 800px, 80% quality, progressive)
    await sharp(fileBuffer)
      .resize(WHATSAPP_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({
        quality: WHATSAPP_QUALITY,
        progressive: true,
      })
      .toFile(whatsappPath);
    this.logger.debug(`Generated WhatsApp version: ${whatsappPath}`);

    // 3. Generate Web version (WebP 400px, 75% quality)
    await sharp(fileBuffer)
      .resize(WEB_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: WEB_QUALITY })
      .toFile(webPath);
    this.logger.debug(`Generated Web version: ${webPath}`);

    // 4. Generate Thumbnail (WebP 150x150 crop center, 70% quality)
    await sharp(fileBuffer)
      .resize(THUMB_SIZE, THUMB_SIZE, {
        fit: 'cover',
        position: 'centre',
      })
      .webp({ quality: THUMB_QUALITY })
      .toFile(thumbPath);
    this.logger.debug(`Generated thumbnail: ${thumbPath}`);

    // Get original file size
    const stats = await fs.promises.stat(originalPath);

    return {
      originalPath: this.getRelativePath(originalPath),
      whatsappPath: this.getRelativePath(whatsappPath),
      webPath: this.getRelativePath(webPath),
      thumbPath: this.getRelativePath(thumbPath),
      mimeType,
      originalSize: stats.size,
      processedAt: new Date(),
    };
  }

  private getExtensionFromMime(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/webp': '.webp',
    };
    return mimeToExt[mimeType] || '.jpg';
  }

  private getRelativePath(absolutePath: string): string {
    // Return path relative to uploads/products
    const parts = absolutePath.split(path.sep);
    const productsIndex = parts.indexOf('products');
    if (productsIndex !== -1) {
      return path.join(...parts.slice(productsIndex));
    }
    return absolutePath;
  }

  // Helper to validate image buffer
  async validateImage(
    buffer: Buffer,
  ): Promise<{ valid: boolean; mimeType: string; error?: string }> {
    try {
      const metadata = await sharp(buffer).metadata();

      if (!metadata.format) {
        return {
          valid: false,
          mimeType: '',
          error: 'Unable to determine image format',
        };
      }

      const validFormats = ['jpeg', 'png', 'webp', 'jpg'];
      if (!validFormats.includes(metadata.format)) {
        return {
          valid: false,
          mimeType: metadata.format,
          error: `Unsupported format: ${metadata.format}`,
        };
      }

      const mimeTypeMap: Record<string, string> = {
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        jpg: 'image/jpeg',
      };

      return {
        valid: true,
        mimeType: mimeTypeMap[metadata.format] || 'image/jpeg',
      };
    } catch {
      return { valid: false, mimeType: '', error: 'Invalid image data' };
    }
  }
}
