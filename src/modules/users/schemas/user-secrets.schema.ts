import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserSecretsDocument = UserSecrets & Document;

@Schema({
  timestamps: true,
  collection: 'user_secrets',
})
export class UserSecrets {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    select: false,
  })
  passwordHash: string;

  @Prop({
    required: false,
    select: false,
    default: null,
  })
  passwordSalt: string;

  @Prop({
    required: false,
    default: null,
  })
  passwordChangedAt: Date;

  @Prop({
    required: false,
    select: false,
    default: null,
  })
  otpSecret: string;

  @Prop({
    required: true,
    default: false,
  })
  otpEnabled: boolean;

  @Prop({
    type: [String],
    required: false,
    default: [],
    select: false,
  })
  otpBackupCodes: string[];

  @Prop({
    required: false,
    default: null,
  })
  otpExpiresAt: Date;

  @Prop({
    required: false,
    default: null,
  })
  otpEnabledAt: Date;

  @Prop({
    required: false,
    default: null,
  })
  lastOtpUsedAt: Date;

  @Prop({
    required: false,
    select: false,
    default: null,
  })
  passwordResetToken: string;

  @Prop({
    required: false,
    default: null,
  })
  passwordResetExpiresAt: Date;

  @Prop({
    required: false,
    select: false,
    default: null,
  })
  emailVerificationToken: string;

  @Prop({
    required: false,
    default: null,
  })
  emailVerificationExpiresAt: Date;

  @Prop({
    type: [Object],
    required: false,
    default: [],
  })
  refreshTokens: Array<{
    token: string;
    expiresAt: Date;
    deviceInfo?: string;
    ipAddress?: string;
    createdAt: Date;
  }>;

  @Prop({
    type: [Object],
    required: false,
    default: [],
  })
  loginAttempts: Array<{
    ipAddress: string;
    userAgent: string;
    success: boolean;
    attemptedAt: Date;
  }>;

  @Prop({
    required: false,
    default: 0,
  })
  failedLoginAttempts: number;

  @Prop({
    required: false,
    default: null,
  })
  lockedUntil: Date;
}

export const UserSecretsSchema = SchemaFactory.createForClass(UserSecrets);

UserSecretsSchema.index({ user: 1 }, { unique: true });
UserSecretsSchema.index({ passwordResetToken: 1 });
UserSecretsSchema.index({ emailVerificationToken: 1 });
UserSecretsSchema.index({ 'refreshTokens.token': 1 });
UserSecretsSchema.index({ lockedUntil: 1 });
