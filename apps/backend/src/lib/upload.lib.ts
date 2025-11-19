/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.lib';

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  originalName: string;
  mimeType: string;
}

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFiles(
    files: UploadedFile[],
    path: string,
    workspaceId: string,
    maxFileSize: number = 10 * 1024 * 1024,
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds maximum size of ${maxFileSize / (1024 * 1024)}MB`,
        );
      }

      try {
        const uploadResult = await this.cloudinaryService.uploadFile(
          file.buffer,
          file.originalname,
          path,
          workspaceId,
        );

        results.push({
          ...uploadResult,
          originalName: file.originalname,
          mimeType: file.mimetype,
        });
      } catch (error) {
        throw new BadRequestException(
          `Failed to upload file ${file.originalname}: ${error.message}`,
        );
      }
    }

    return results;
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await this.cloudinaryService.deleteFile(publicId);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }
}
