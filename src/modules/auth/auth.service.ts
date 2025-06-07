import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  UserSecrets,
  UserSecretsDocument,
} from '../users/schemas/user-secrets.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { generateOTP } from '../../lib/random.lib';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserSecrets.name)
    private userSecretsModel: Model<UserSecretsDocument>,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    const { email, password, timezone } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 12);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = new this.userModel({
      email,
      timezone,
      otp,
      otpExpiresAt,
      otpVerified: false,
    });

    const savedUser = await user.save();

    const userSecrets = new this.userSecretsModel({
      user: savedUser._id,
      passwordHash: hashedPassword,
    });

    await userSecrets.save();
    return savedUser;
  }

  async login(loginDto: LoginDto): Promise<UserDocument> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email, isActive: true });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userSecrets = await this.userSecretsModel
      .findOne({ user: user._id })
      .select('+passwordHash');
    if (!userSecrets) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      userSecrets.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();

    return user;
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
}
