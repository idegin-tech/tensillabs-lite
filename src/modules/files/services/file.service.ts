import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PaginateModel } from 'mongoose';
import { File, FileDocument } from '../schemas/file.schema';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<FileDocument> & PaginateModel<FileDocument>,
  ) {}

  async create(
    fileData: {
      name: string;
      thumbnailURL?: string;
      size: number;
      description?: string;
      mimeType?: string;
      fileURL?: string;
      fileKey?: string;
      task?: Types.ObjectId;
      space?: Types.ObjectId;
    },
    workspaceId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ): Promise<FileDocument> {
    const file = new this.fileModel({
      ...fileData,
      workspace: workspaceId,
      createdBy,
    });

    return await file.save();
  }

  async update(
    fileId: Types.ObjectId,
    updateData: {
      name?: string;
      thumbnailURL?: string;
      description?: string;
      task?: Types.ObjectId;
      space?: Types.ObjectId;
      isActive?: boolean;
    },
    workspaceId: Types.ObjectId,
  ): Promise<FileDocument> {
    const file = await this.fileModel
      .findOneAndUpdate(
        {
          _id: fileId,
          workspace: workspaceId,
          isDeleted: false,
        },
        { $set: updateData },
        { new: true },
      )
      .exec();

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async delete(
    fileId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<FileDocument> {
    const file = await this.fileModel
      .findOneAndUpdate(
        {
          _id: fileId,
          workspace: workspaceId,
          isDeleted: false,
        },
        { $set: { isDeleted: true } },
        { new: true },
      )
      .exec();

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async findByTask(
    taskId: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<FileDocument[]> {
    return await this.fileModel
      .find({
        task: taskId,
        workspace: workspaceId,
        isDeleted: false,
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
