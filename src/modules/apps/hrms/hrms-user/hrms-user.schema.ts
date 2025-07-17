import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HrmsUserDocument = HrmsUser & Document;

export enum HrmsUserPermission {
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Schema({
  timestamps: true,
  collection: 'hrms_users',
})
export class HrmsUser {
  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
  })
  member: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(HrmsUserPermission),
    required: true,
    default: HrmsUserPermission.MANAGER,
  })
  permission: HrmsUserPermission;
}

export const HrmsUserSchema = SchemaFactory.createForClass(HrmsUser);
HrmsUserSchema.index({ member: 1, workspace: 1 }, { unique: true });

