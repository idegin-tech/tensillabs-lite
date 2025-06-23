import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChecklistDocument = Checklist & Document;

@Schema({
  timestamps: true,
  collection: 'checklists',
})
export class Checklist {
  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
  })
  name: string;

  @Prop({
    required: true,
    default: false,
  })
  isDone: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Task',
    required: false,
    default: null,
  })
  task: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Space',
    required: false,
    default: null,
  })
  space: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'List',
    required: false,
    default: null,
  })
  list: Types.ObjectId;

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
}

export const ChecklistSchema = SchemaFactory.createForClass(Checklist);

ChecklistSchema.index({ task: 1 });
ChecklistSchema.index({ workspace: 1 });
ChecklistSchema.index({ space: 1 });
ChecklistSchema.index({ list: 1 });
ChecklistSchema.index({ createdBy: 1 });
ChecklistSchema.index({ isDeleted: 1 });
ChecklistSchema.index({ isDone: 1 });
