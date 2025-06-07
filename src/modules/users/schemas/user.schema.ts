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
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    default: 'Africa/Lagos',
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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
