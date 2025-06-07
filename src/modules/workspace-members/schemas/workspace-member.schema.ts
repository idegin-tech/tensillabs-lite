import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkspaceMemberDocument = WorkspaceMember & Document;

export enum Permission {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  REGULAR = 'regular',
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
  })
  firstName: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 50,
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
  })
  bio: string;

  @Prop({
    required: false,
    trim: true,
  })
  phoneNumber: string;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;

  @Prop({
    required: false,
  })
  joinedAt: Date;

  @Prop({
    required: false,
  })
  lastActiveAt: Date;

  @Prop({
    required: false,
    trim: true,
    maxlength: 100,
  })
  jobTitle: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 100,
  })
  department: string;

  @Prop({
    required: false,
  })
  invitedBy: Types.ObjectId;

  @Prop({
    required: false,
  })
  invitedAt: Date;

  @Prop({
    required: false,
  })
  acceptedAt: Date;
}

export const WorkspaceMemberSchema =
  SchemaFactory.createForClass(WorkspaceMember);

WorkspaceMemberSchema.index({ user: 1, workspace: 1 }, { unique: true });
WorkspaceMemberSchema.index({ workspace: 1 });
WorkspaceMemberSchema.index({ user: 1 });
WorkspaceMemberSchema.index({ permission: 1 });
WorkspaceMemberSchema.index({ isActive: 1 });
WorkspaceMemberSchema.index({ primaryEmail: 1 });
