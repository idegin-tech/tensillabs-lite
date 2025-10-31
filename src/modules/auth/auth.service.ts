import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/schemas/user.schema';
import { UserSecretsService } from '../users/services/user-secrets.service';
import {
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
  ResendOtpDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userSecretsService: UserSecretsService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, timezone } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = this.userRepository.create({
      email,
      timezone,
      isEmailVerified: false,
    });

    const savedUser = await this.userRepository.save(user);

    await this.userSecretsService.createUserSecrets(savedUser.id, password);

    await this.userSecretsService.generateAndSaveOTP(savedUser.id);

    return savedUser;
  }

  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isLocked = await this.userSecretsService.isAccountLocked(user.id);

    if (isLocked) {
      const lockInfo =
        await this.userSecretsService.getAccountLockInfo(user.id);

      if (lockInfo.lockedUntil) {
        const remainingTime = Math.ceil(
          (lockInfo.lockedUntil.getTime() - Date.now()) / (1000 * 60),
        );
        throw new UnauthorizedException(
          `Account is temporarily locked. Please try again in ${remainingTime} minute(s).`,
        );
      }
    }

    const isPasswordValid = await this.userSecretsService.verifyPassword(
      user.id,
      password.trim(),
    );

    if (!isPasswordValid) {
      await this.userSecretsService.incrementFailedLoginAttempts(user.id);

      const lockInfo =
        await this.userSecretsService.getAccountLockInfo(user.id);

      if (lockInfo.isLocked) {
        throw new UnauthorizedException(
          'Too many failed login attempts. Account has been temporarily locked for 30 minutes.',
        );
      } else {
        const remainingAttempts = 8 - lockInfo.failedAttempts;
        throw new UnauthorizedException(
          `Invalid credentials. ${remainingAttempts} attempt(s) remaining before account lock.`,
        );
      }
    }

    await this.userSecretsService.resetFailedLoginAttempts(user.id);

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return user;
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ success: boolean; message: string; user?: any }> {
    const { email, otp } = verifyEmailDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const isOtpValid = await this.userSecretsService.verifyOTP(user.id, otp);

    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isEmailVerified = true;
    await this.userRepository.save(user);

    await this.userSecretsService.clearOTP(user.id);

    return {
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        timezone: user.timezone,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async resendOtp(
    resendOtpDto: ResendOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = resendOtpDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const otp = await this.userSecretsService.generateAndSaveOTP(user.id);

    // TODO: Send email with OTP (implementation depends on email service)
    console.log(`New OTP for ${email}: ${otp}`);

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  async findUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      return user;
    } catch {
      return null;
    }
  }
}
