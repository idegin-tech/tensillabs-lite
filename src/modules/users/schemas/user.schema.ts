import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
    default: 'UTC',
  })
  timezone: string;

  @Prop({
    required: true,
    default: false,
  })
  isEmailVerified: boolean;

  @Prop({
    required: false,
  })
  lastLoginAt: Date;

  @Prop({
    required: false,
  })
  emailVerifiedAt: Date;

  @Prop({
    required: false,
    select: false,
  })
  otp: string;

  @Prop({
    required: false,
  })
  otpExpiresAt: Date;

  @Prop({
    required: true,
    default: false,
  })
  otpVerified: boolean;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
