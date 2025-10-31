import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSecrets } from '../schemas/user-secrets.schema';
import { generateOTP } from '../../../lib/random.lib';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserSecretsService {
  constructor(
    @InjectRepository(UserSecrets)
    private userSecretsRepository: Repository<UserSecrets>,
  ) {}

  async createUserSecrets(
    userId: string,
    password: string,
  ): Promise<UserSecrets> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const userSecrets = this.userSecretsRepository.create({
      userId,
      passwordHash,
      passwordSalt: salt,
    });

    return await this.userSecretsRepository.save(userSecrets);
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const userSecrets = await this.userSecretsRepository.findOne({
      where: { userId },
    });

    if (!userSecrets) {
      return false;
    }

    return await bcrypt.compare(password, userSecrets.passwordHash);
  }

  async generateAndSaveOTP(userId: string): Promise<string> {
    const otp = generateOTP(6);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.userSecretsRepository.update(
      { userId },
      {
        otpSecret: otp,
        otpExpiresAt: otpExpiresAt,
      },
    );

    return otp;
  }

  async verifyOTP(userId: string, otp: string): Promise<boolean> {
    const userSecrets = await this.userSecretsRepository.findOne({
      where: { userId },
    });

    if (!userSecrets || !userSecrets.otpSecret) {
      return false;
    }

    if (userSecrets.otpExpiresAt && userSecrets.otpExpiresAt < new Date()) {
      return false;
    }

    return userSecrets.otpSecret === otp;
  }

  async clearOTP(userId: string): Promise<void> {
    await this.userSecretsRepository.update(
      { userId },
      {
        otpSecret: null,
        otpExpiresAt: null,
      },
    );
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.userSecretsRepository.update(
      { userId },
      {
        passwordHash,
        passwordSalt: salt,
        passwordChangedAt: new Date(),
      },
    );
  }

  async incrementFailedLoginAttempts(userId: string): Promise<void> {
    const userSecrets = await this.userSecretsRepository.findOne({
      where: { userId },
    });

    if (!userSecrets) {
      return;
    }

    const failedAttempts = userSecrets.failedLoginAttempts + 1;

    if (failedAttempts >= 8) {
      const lockUntil = new Date(Date.now() + 30 * 60 * 1000);

      await this.userSecretsRepository.update(
        { userId },
        {
          failedLoginAttempts: 0,
          lockedUntil: lockUntil,
        },
      );
    } else {
      await this.userSecretsRepository.update(
        { userId },
        {
          failedLoginAttempts: failedAttempts,
        },
      );
    }
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    await this.userSecretsRepository.update(
      { userId },
      {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    );
  }

  async isAccountLocked(userId: string): Promise<boolean> {
    const userSecrets = await this.userSecretsRepository.findOne({
      where: { userId },
    });

    if (!userSecrets || !userSecrets.lockedUntil) {
      return false;
    }

    if (userSecrets.lockedUntil < new Date()) {
      await this.resetFailedLoginAttempts(userId);
      return false;
    }

    return true;
  }

  async getAccountLockInfo(userId: string): Promise<{
    isLocked: boolean;
    lockedUntil?: Date;
    failedAttempts: number;
  }> {
    const userSecrets = await this.userSecretsRepository.findOne({
      where: { userId },
    });

    if (!userSecrets) {
      return {
        isLocked: false,
        failedAttempts: 0,
      };
    }

    const isLocked = await this.isAccountLocked(userId);

    return {
      isLocked,
      lockedUntil: userSecrets.lockedUntil || undefined,
      failedAttempts: userSecrets.failedLoginAttempts,
    };
  }
}
