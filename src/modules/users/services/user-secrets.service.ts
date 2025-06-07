import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserSecrets,
  UserSecretsDocument,
} from '../schemas/user-secrets.schema';
import { generateOTP } from '../../../lib/random.lib';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserSecretsService {
  constructor(
    @InjectModel(UserSecrets.name)
    private userSecretsModel: Model<UserSecretsDocument>,
  ) {}

  async createUserSecrets(
    userId: Types.ObjectId,
    password: string,
  ): Promise<UserSecretsDocument> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const userSecrets = new this.userSecretsModel({
      user: userId,
      passwordHash,
      passwordSalt: salt,
    });

    return await userSecrets.save();
  }

  async verifyPassword(
    userId: Types.ObjectId,
    password: string,
  ): Promise<boolean> {
    const userSecrets = await this.userSecretsModel
      .findOne({ user: userId })
      .select('+passwordHash');

    if (!userSecrets) {
      return false;
    }

    return await bcrypt.compare(password, userSecrets.passwordHash);
  }

  async generateAndSaveOTP(userId: Types.ObjectId): Promise<string> {
    const otp = generateOTP(6);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.userSecretsModel.updateOne(
      { user: userId },
      {
        $set: {
          otpSecret: otp,
          otpExpiresAt: otpExpiresAt,
        },
      },
    );

    return otp;
  }

  async verifyOTP(userId: Types.ObjectId, otp: string): Promise<boolean> {
    const userSecrets = await this.userSecretsModel
      .findOne({ user: userId })
      .select('+otpSecret otpExpiresAt');

    if (!userSecrets || !userSecrets.otpSecret) {
      return false;
    }

    // Check if OTP has expired
    if (userSecrets.otpExpiresAt && userSecrets.otpExpiresAt < new Date()) {
      return false;
    }

    return userSecrets.otpSecret === otp;
  }

  async clearOTP(userId: Types.ObjectId): Promise<void> {
    await this.userSecretsModel.updateOne(
      { user: userId },
      {
        $unset: {
          otpSecret: 1,
          otpExpiresAt: 1,
        },
        $set: {
          lastOtpUsedAt: new Date(),
        },
      },
    );
  }

  async updatePassword(
    userId: Types.ObjectId,
    newPassword: string,
  ): Promise<void> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.userSecretsModel.updateOne(
      { user: userId },
      {
        $set: {
          passwordHash,
          passwordSalt: salt,
          passwordChangedAt: new Date(),
        },
      },
    );
  }

  async addLoginAttempt(
    userId: Types.ObjectId,
    ipAddress: string,
    userAgent: string,
    success: boolean,
  ): Promise<void> {
    await this.userSecretsModel.updateOne(
      { user: userId },
      {
        $push: {
          loginAttempts: {
            ipAddress,
            userAgent,
            success,
            attemptedAt: new Date(),
          },
        },
        $inc: {
          failedLoginAttempts: success ? -1 : 1,
        },
      },
    );
  }
}
