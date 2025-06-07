import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkspaceMemberDocument = WorkspaceMember & Document;

export enum Permission {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  REGULAR = 'regular',
}

export enum MemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Schema({
  timestamps: true,
  collection: 'workspace_members',
})
export class WorkspaceMember {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    type: Object,
    required: false,
    default: { sm: '', original: '' },
  })
  avatarURL: {
    sm: string;
    original: string;
  };

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 2,
  })
  firstName: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 50,
    default: null,
  })
  middleName: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  lastName: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
  })
  primaryEmail: string;

  @Prop({
    required: false,
    lowercase: true,
    trim: true,
    default: null,
  })
  secondaryEmail: string;

  @Prop({
    type: String,
    enum: Object.values(Permission),
    required: true,
    default: Permission.REGULAR,
  })
  permission: Permission;

  @Prop({
    required: false,
    trim: true,
    maxlength: 500,
    default: null,
  })
  bio: string;

  @Prop({
    required: false,
    trim: true,
    default: null,
  })
  workPhone: string;

  @Prop({
    required: false,
    trim: true,
    default: null,
  })
  mobilePhone: string;

  @Prop({
    type: String,
    enum: Object.values(MemberStatus),
    required: true,
    default: MemberStatus.ACTIVE,
  })
  status: MemberStatus;

  @Prop({
    required: false,
    default: null,
  })
  lastActiveAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  })
  invitedBy: Types.ObjectId;
}

export const WorkspaceMemberSchema =
  SchemaFactory.createForClass(WorkspaceMember);

WorkspaceMemberSchema.index({ user: 1, workspace: 1 }, { unique: true });
WorkspaceMemberSchema.index({ workspace: 1 });
WorkspaceMemberSchema.index({ user: 1 });
WorkspaceMemberSchema.index({ permission: 1 });
WorkspaceMemberSchema.index({ status: 1 });
WorkspaceMemberSchema.index({ primaryEmail: 1 });
