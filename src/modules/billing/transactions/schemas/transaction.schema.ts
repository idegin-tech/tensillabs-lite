import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type TransactionDocument = Transaction & Document;

@Schema({
  timestamps: true,
  collection: 'transactions',
})
export class Transaction {
  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Wallet',
    required: true,
  })
  wallet: Types.ObjectId;

  @Prop({
    required: true,
    default: false,
  })
  paid: boolean;

  @Prop({
    required: true,
  })
  numberOfMembers: number;

  @Prop({
    required: false,
  })
  paidOn: Date;

  @Prop({
    required: true,
    default: 0,
  })
  discountPercentage: number;

  @Prop({
    required: true,
  })
  dueDate: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.index({ workspace: 1 });
TransactionSchema.index({ wallet: 1 });
TransactionSchema.index({ paid: 1 });
TransactionSchema.index({ paidOn: 1 });
TransactionSchema.index({ dueDate: 1 });

TransactionSchema.plugin(mongoosePaginate);
