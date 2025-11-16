import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../schemas/file.schema';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) { }

  async create(
    fileData: {
      name: string;
      thumbnailURL?: string;
      size: number;
      description?: string;
      mimeType?: string;
      fileURL?: string;
      fileKey?: string;
      taskId?: string;
      spaceId?: string;
      commentId?: string;
      listId?: string;
      leaveRequestId?: string;
    },
    workspaceId: string,
    createdById: string,
  ): Promise<File> {
    const file = this.fileRepository.create({
      ...fileData,
      workspaceId,
      createdById,
    });

    return await this.fileRepository.save(file);
  }

  async update(
    fileId: string,
    updateData: {
      name?: string;
      thumbnailURL?: string;
      description?: string;
      taskId?: string;
      spaceId?: string;
      commentId?: string;
      listId?: string;
      isActive?: boolean;
    },
    workspaceId: string,
  ): Promise<File> {
    await this.fileRepository.update(
      {
        id: fileId,
        workspaceId,
        isDeleted: false,
      },
      updateData,
    );

    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async delete(fileId: string, workspaceId: string): Promise<File> {
    await this.fileRepository.update(
      {
        id: fileId,
        workspaceId,
        isDeleted: false,
      },
      { isDeleted: true },
    );

    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async findByTask(taskId: string, workspaceId: string): Promise<File[]> {
    return await this.fileRepository.find({
      where: {
        taskId,
        workspaceId,
        isDeleted: false,
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteByCommentId(commentId: string, workspaceId: string): Promise<void> {
    await this.fileRepository.update(
      {
        commentId,
        workspaceId,
        isDeleted: false,
      },
      { isDeleted: true },
    );
  }
}
