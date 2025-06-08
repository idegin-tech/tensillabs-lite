import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ClientDocument = Client & Document;

@Schema({
  timestamps: true,
  collection: 'clients',
})
export class Client {
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

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'Office',
    },
  ])
  offices: Types.ObjectId[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.index({ workspace: 1 });
ClientSchema.index({ name: 1 });
ClientSchema.index({ isActive: 1 });
ClientSchema.index({ isDeleted: 1 });
ClientSchema.index({ createdBy: 1 });

ClientSchema.plugin(mongoosePaginate);
