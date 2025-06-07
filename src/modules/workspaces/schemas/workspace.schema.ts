import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkspaceDocument = Workspace & Document;

@Schema({
  timestamps: true,
  collection: 'workspaces',
})
export class Workspace {
  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 500,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: false,
    trim: true,
  })
  logoURL: string;

  @Prop({
    required: false,
    trim: true,
  })
  bannerURL: string;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;

  @Prop({
    required: false,
    trim: true,
    maxlength: 50,
  })
  industry: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 100,
  })
  website: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 200,
  })
  location: string;

  @Prop({
    required: true,
    default: 'standard',
    enum: ['free', 'standard', 'premium', 'enterprise'],
  })
  plan: string;

  @Prop({
    type: Object,
    required: false,
    default: {},
  })
  settings: {
    allowInvites?: boolean;
    requireApproval?: boolean;
    defaultPermission?: string;
    [key: string]: any;
  };
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);

WorkspaceSchema.index({ createdBy: 1 });
WorkspaceSchema.index({ isActive: 1 });
WorkspaceSchema.index({ name: 1 });
WorkspaceSchema.index({ createdAt: -1 });
