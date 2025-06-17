import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ListDocument = List & Document;

@Schema({
  timestamps: true,
  collection: 'lists',
})
export class List {
  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  description?: string;

  @Prop({
    required: true,
    default: false,
  })
  isPrivate: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    required: true,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Space',
    required: true,
  })
  space: Types.ObjectId;
}

export const ListSchema = SchemaFactory.createForClass(List);

ListSchema.index({ space: 1 });
ListSchema.index({ workspace: 1 });
ListSchema.index({ isDeleted: 1 });
ListSchema.index({ isPrivate: 1 });
