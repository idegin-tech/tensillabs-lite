import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

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
    minlength: 2,
  })
  name: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 500,
    default: null,
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
    default: null,
  })
  logoURL: string;

  @Prop({
    required: false,
    trim: true,
    default: null,
  })
  bannerURL: string;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);

WorkspaceSchema.index({ createdBy: 1 });
WorkspaceSchema.index({ name: 1 });
WorkspaceSchema.index({ createdAt: -1 });

WorkspaceSchema.plugin(mongoosePaginate);
