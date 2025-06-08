import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

export enum Currency {
  USD = 'USD',
  NGN = 'NGN',
}

@Schema({
  timestamps: true,
  collection: 'wallets',
})
export class Wallet {
  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    required: true,
    default: 0,
  })
  currentBalance: number;

  @Prop({
    required: true,
    enum: Currency,
  })
  currency: Currency;

  @Prop({
    required: true,
  })
  nextBillingDate: Date;

  @Prop({
    required: true,
    default: 0,
  })
  tier: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.index({ workspace: 1 });
WalletSchema.index({ currency: 1 });
WalletSchema.index({ nextBillingDate: 1 });
