import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type TeamDocument = Team & Document;

@Schema({
  timestamps: true,
  collection: 'teams',
})
export class Team {
  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

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

  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: false,
    trim: true,
    maxlength: 500,
    default: null,
  })
  description: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ workspace: 1 });
TeamSchema.index({ name: 1 });
TeamSchema.index({ isActive: 1 });
TeamSchema.index({ isDeleted: 1 });
TeamSchema.index({ createdBy: 1 });

TeamSchema.plugin(mongoosePaginate);
