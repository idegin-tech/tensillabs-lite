import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
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
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userSecretsService: UserSecretsService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    const { email, password, timezone } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = new this.userModel({
      email,
      timezone,
      isEmailVerified: false,
    });

    const savedUser = await user.save();

    await this.userSecretsService.createUserSecrets(
      savedUser._id as Types.ObjectId,
      password,
    );

    await this.userSecretsService.generateAndSaveOTP(
      savedUser._id as Types.ObjectId,
    );

    return savedUser;
  }

  async login(loginDto: LoginDto): Promise<UserDocument> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordValid = await this.userSecretsService.verifyPassword(
      user._id as Types.ObjectId,
      password.trim(),
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();

    return user;
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ success: boolean; message: string; user?: any }> {
    const { email, otp } = verifyEmailDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const isOtpValid = await this.userSecretsService.verifyOTP(
      user._id as Types.ObjectId,
      otp,
    );

    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    await this.userSecretsService.clearOTP(user._id as Types.ObjectId);

    return {
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        timezone: user.timezone,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    };
  }

  async resendOtp(
    resendOtpDto: ResendOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = resendOtpDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const otp = await this.userSecretsService.generateAndSaveOTP(
      user._id as Types.ObjectId,
    );

    // TODO: Send email with OTP (implementation depends on email service)
    console.log(`New OTP for ${email}: ${otp}`);

    return {
      success: true,
      message: 'OTP sent successfully',
    };
  }

  async findUserById(userId: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findById(userId).exec();
      return user;
    } catch {
      return null;
    }
  }
}
