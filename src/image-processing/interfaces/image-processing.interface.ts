export interface ImageProcessingResult {
  originalPath: string;
  whatsappPath: string;
  webPath: string;
  thumbPath: string;
  mimeType: string;
  originalSize: number;
  processedAt: Date;
}

export interface ImageJobData {
  productId?: number;
  productLinkId?: number;
  fileBuffer: Buffer;
  originalFilename: string;
  mimeType: string;
  uuid: string;
}

export interface JobProgress {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: ImageProcessingResult;
  error?: string;
}
