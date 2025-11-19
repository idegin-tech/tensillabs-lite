/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    path: string,
    workspaceId: string,
  ): Promise<{
    url: string;
    publicId: string;
    secureUrl: string;
    format: string;
    resourceType: string;
    bytes: number;
  }> {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fullPath = `tensillabs/${workspaceId}${path}/${timestamp}_${sanitizedFileName}`;

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: fullPath,
            resource_type: 'auto',
            use_filename: false,
            unique_filename: true,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                url: result.url,
                publicId: result.public_id,
                secureUrl: result.secure_url,
                format: result.format,
                resourceType: result.resource_type,
                bytes: result.bytes,
              });
            } else {
              reject(new Error('Upload failed'));
            }
          },
        )
        .end(buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
