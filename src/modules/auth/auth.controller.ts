import {
  Controller,
  Post,
  Body,
  UsePipes,
  Session,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../../lib/validation.pipe';
import {
  loginSchema,
  registerSchema,
  LoginDto,
  RegisterDto,
} from './dto/auth.dto';

interface SessionData {
  userId?: string;
  userEmail?: string;
  destroy(callback: (err?: any) => void): void;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(
    @Body() registerDto: RegisterDto,
    @Session() session: SessionData,
  ) {
    const user = await this.authService.register(registerDto);

    session.userId = String(user._id);
    session.userEmail = user.email;

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        timezone: user.timezone,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto, @Session() session: SessionData) {
    const user = await this.authService.login(loginDto);

    session.userId = String(user._id);
    session.userEmail = user.email;

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        timezone: user.timezone,
        lastLoginAt: user.lastLoginAt,
      },
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Session() session: SessionData, @Req() req: Request) {
    if (!session.userId) {
      return { success: false, message: 'No active session' };
    }

    const user = await this.authService.findUserById(session.userId);
    if (!user) {
      session.destroy(() => {});
      return { success: false, message: 'User not found' };
    }

    if (req.session && typeof req.session.touch === 'function') {
      req.session.touch();
    }

    return {
      success: true,
      message: 'Token refreshed successfully',
      user: {
        id: user._id,
        email: user.email,
        timezone: user.timezone,
      },
    };
  }

  @Get('me')
  async getProfile(@Session() session: SessionData) {
    if (!session.userId) {
      return { success: false, message: 'Not authenticated' };
    }

    const user = await this.authService.findUserById(session.userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        timezone: user.timezone,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Session() session: SessionData, @Res() res: Response) {
    session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: 'Could not log out' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logged out successfully' });
    });
  }
}
