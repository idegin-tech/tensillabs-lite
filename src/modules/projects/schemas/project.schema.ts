import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ProjectDocument = Project & Document;

@Schema({
  timestamps: true,
  collection: 'projects',
})
export class Project {
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
    default: null,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Client',
    required: false,
  })
  client: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;

  @Prop({
    required: true,
    default: false,
  })
  isDeleted: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ workspace: 1 });
ProjectSchema.index({ name: 1 });
ProjectSchema.index({ client: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ isDeleted: 1 });
ProjectSchema.index({ createdBy: 1 });

ProjectSchema.plugin(mongoosePaginate);
