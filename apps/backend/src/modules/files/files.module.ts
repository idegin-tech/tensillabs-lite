import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './schemas/file.schema';
import { FileService } from './services/file.service';
import { CloudinaryService } from '../../lib/cloudinary.lib';
import { UploadService } from '../../lib/upload.lib';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
  ],
  providers: [FileService, CloudinaryService, UploadService],
  exports: [FileService, CloudinaryService, UploadService],
})
export class FilesModule {}
