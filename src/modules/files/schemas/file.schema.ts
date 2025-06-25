import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type FileDocument = File & Document;

@Schema({
  timestamps: true,
  collection: 'files',
})
export class File {
  @Prop({
    required: true,
    trim: true,
    maxlength: 255,
  })
  name: string;

  @Prop({
    required: false,
    trim: true,
    default: null,
  })
  thumbnailURL: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Task',
    required: false,
    default: null,
  })
  task: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Space',
    required: false,
    default: null,
  })
  space: Types.ObjectId;

  @Prop({
    required: true,
    default: 0,
  })
  size: number;

  @Prop({
    required: false,
    trim: true,
    maxlength: 500,
    default: null,
  })
  description: string;

  @Prop({
    required: false,
    trim: true,
    default: null,
  })
  mimeType: string;

  @Prop({
    required: false,
    trim: true,
    default: null,
  })
  fileURL: string;

  @Prop({
    required: false,
    trim: true,
    default: null,
  })
  fileKey: string;

  @Prop({
    required: true,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;
}

export const FileSchema = SchemaFactory.createForClass(File);

FileSchema.index({ workspace: 1 });
FileSchema.index({ createdBy: 1 });
FileSchema.index({ task: 1 });
FileSchema.index({ space: 1 });
FileSchema.index({ isDeleted: 1 });
FileSchema.index({ isActive: 1 });
FileSchema.index({ name: 'text', description: 'text' });
FileSchema.index({ createdAt: -1 });
FileSchema.index({ size: 1 });
FileSchema.index({ mimeType: 1 });

FileSchema.plugin(mongoosePaginate);
