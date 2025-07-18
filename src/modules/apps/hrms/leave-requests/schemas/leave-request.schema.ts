import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeaveRequestDocument = LeaveRequest & Document;

export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  CASUAL = 'casual',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  UNPAID = 'unpaid',
  OTHER = 'other',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({
  timestamps: true,
  collection: 'leave_requests',
})
export class LeaveRequest {
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
    enum: Object.values(LeaveType),
    required: true,
  })
  type: LeaveType;

  @Prop({
    type: Date,
    required: true,
  })
  startDate: Date;

  @Prop({
    type: Date,
    required: true,
  })
  endDate: Date;

  @Prop({
    type: String,
    maxlength: 1000,
    required: false,
    default: null,
  })
  reason?: string;

  @Prop({
    type: String,
    enum: Object.values(LeaveStatus),
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: false,
    default: null,
  })
  approvedBy?: Types.ObjectId;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  approvedAt?: Date;
}

export const LeaveRequestSchema = SchemaFactory.createForClass(LeaveRequest);
LeaveRequestSchema.index({ member: 1, workspace: 1, startDate: 1 });

