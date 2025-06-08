import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type OfficeDocument = Office & Document;

@Schema({
  timestamps: true,
  collection: 'offices',
})
export class Office {
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

  @Prop({
    required: false,
    trim: true,
    maxlength: 500,
    default: null,
  })
  address: string;
}

export const OfficeSchema = SchemaFactory.createForClass(Office);

OfficeSchema.index({ workspace: 1 });
OfficeSchema.index({ name: 1 });
OfficeSchema.index({ isActive: 1 });
OfficeSchema.index({ isDeleted: 1 });
OfficeSchema.index({ createdBy: 1 });

OfficeSchema.plugin(mongoosePaginate);
