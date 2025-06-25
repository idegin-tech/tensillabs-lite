import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export enum TaskPriority {
  URGENT = 'urgent',
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

@Schema({
  timestamps: true,
  collection: 'tasks',
})
export class Task {
  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  task_id: string;

  @Prop({
    type: String,
    enum: Object.values(TaskPriority),
    required: false,
    default: null,
  })
  priority: TaskPriority;

  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    required: true,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Prop({
    type: {
      start: { type: Date, required: false },
      end: { type: Date, required: false },
    },
    required: false,
    default: null,
  })
  timeframe: {
    start?: Date;
    end?: Date;
  };

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'WorkspaceMember' }],
    required: false,
    default: [],
  })
  assignee: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Space',
    required: true,
  })
  space: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'List',
    required: true,
  })
  list: Types.ObjectId;

  @Prop({
    trim: true,
    maxlength: 98000,
    required: false,
    default: null,
  })
  description: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ list: 1 });
TaskSchema.index({ space: 1 });
TaskSchema.index({ workspace: 1 });
TaskSchema.index({ createdBy: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ isDeleted: 1 });
TaskSchema.index({ assignee: 1 });
TaskSchema.index({ task_id: 1 });
