import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type RoleDocument = Role & Document;

@Schema({
  timestamps: true,
  collection: 'roles',
})
export class Role {
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

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ workspace: 1 });
RoleSchema.index({ name: 1 });
RoleSchema.index({ isActive: 1 });
RoleSchema.index({ isDeleted: 1 });
RoleSchema.index({ createdBy: 1 });

RoleSchema.plugin(mongoosePaginate);
