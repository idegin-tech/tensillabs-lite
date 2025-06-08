import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SpaceDocument = Space & Document;

@Schema({
  timestamps: true,
  collection: 'spaces',
})
export class Space {
  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    required: true,
    default: '#3B82F6',
  })
  color: string;

  @Prop({
    required: true,
    default: 'fa-folder',
  })
  icon: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    default: false,
  })
  isPublic: boolean;

  @Prop({
    required: true,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);

SpaceSchema.index({ workspace: 1 });
SpaceSchema.index({ createdBy: 1 });
SpaceSchema.index({ isDeleted: 1 });
SpaceSchema.index({ isPublic: 1 });
