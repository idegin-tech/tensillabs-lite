import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({
  timestamps: true,
  collection: 'attendances',
})
export class Attendance {
  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
  })
  member: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Office',
    required: false,
    default: null,
  })
  office?: Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
  })
  clockIn: Date;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  clockOut?: Date;

  @Prop({
    type: String,
    maxlength: 500,
    required: false,
    default: null,
  })
  remarks?: string;

  @Prop({
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  })
  status: 'open' | 'closed';
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.index({ member: 1, office: 1, clockIn: 1 });
