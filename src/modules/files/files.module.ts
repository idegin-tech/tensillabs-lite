import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';
import { FileService } from './services/file.service';
import { CloudinaryService } from '../../lib/cloudinary.lib';
import { UploadService } from '../../lib/upload.lib';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  providers: [FileService, CloudinaryService, UploadService],
  exports: [FileService, CloudinaryService, UploadService],
})
export class FilesModule {}
