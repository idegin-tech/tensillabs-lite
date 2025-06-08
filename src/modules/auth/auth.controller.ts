/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  Session,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../../lib/validation.pipe';
import { createSuccessResponse } from '../../lib/response.interface';
import {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
  ResendOtpDto,
} from './dto/auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

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
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return createSuccessResponse(
      'User registered successfully. Please verify your email.',
      {
        user: {
          id: user._id,
          email: user.email,
          timezone: user.timezone,
          isEmailVerified: user.isEmailVerified,
        },
      },
    );
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(verifyEmailSchema))
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const result = await this.authService.verifyEmail(verifyEmailDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return createSuccessResponse(result.message, { user: result.user });
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(resendOtpSchema))
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    const result = await this.authService.resendOtp(resendOtpDto);
    return createSuccessResponse(result.message);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: SessionData,
    @Req() req: Request,
  ) {
    console.log('[DEBUG] Login attempt for:', loginDto.email);
    console.log('[DEBUG] Session ID:', req.sessionID);
    console.log('[DEBUG] Session before login:', {
      userId: session.userId,
      userEmail: session.userEmail,
      sessionExists: !!session,
    });

    const user = await this.authService.login(loginDto);

    session.userId = String(user._id);
    session.userEmail = user.email;

    console.log('[DEBUG] Session after setting data:', {
      userId: session.userId,
      userEmail: session.userEmail,
      sessionID: req.sessionID,
    });

    return new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('[DEBUG] Session save error:', err);
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(err);
        } else {
          console.log(
            '[DEBUG] Session saved successfully for user:',
            user.email,
          );
          resolve(
            createSuccessResponse('Login successful', {
              user: {
                id: user._id,
                email: user.email,
                timezone: user.timezone,
                lastLoginAt: user.lastLoginAt,
                isEmailVerified: user.isEmailVerified,
              },
            }),
          );
        }
      });
    });
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Session() session: SessionData, @Req() req: Request) {
    if (!session.userId) {
      return createSuccessResponse('No active session', null);
    }

    const user = await this.authService.findUserById(session.userId);
    if (!user) {
      session.destroy(() => {});
      return createSuccessResponse('User not found', null);
    }

    if (!user.isEmailVerified) {
      session.destroy(() => {});
      return createSuccessResponse('Email not verified', null);
    }

    if (req.session && typeof req.session.touch === 'function') {
      req.session.touch();
    }

    return createSuccessResponse('Token refreshed successfully', {
      user: {
        id: user._id,
        email: user.email,
        timezone: user.timezone,
        lastLoginAt: user.lastLoginAt,
        isEmailVerified: user.isEmailVerified,
      },
    });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@CurrentUser() user: UserDocument) {
    return createSuccessResponse('User data retrieved successfully', {
      user: {
        id: user._id,
        email: user.email,
        timezone: user.timezone,
        lastLoginAt: user.lastLoginAt,
        isEmailVerified: user.isEmailVerified,
      },
    });
  }

  @Get('session-debug')
  @HttpCode(HttpStatus.OK)
  debugSession(@Session() session: SessionData) {
    console.log('[DEBUG] Session debug - Full session:', session);
    return createSuccessResponse('Session data retrieved successfully', {
      session: {
        userId: session.userId,
        userEmail: session.userEmail,
        hasSession: !!session,
      },
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Session() session: SessionData,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const sessionId = req.sessionID;

    session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json(createSuccessResponse('Could not log out', null));
      }

      if (req.sessionStore && sessionId) {
        req.sessionStore.destroy(sessionId, (storeErr) => {
          if (storeErr) {
            console.error('Error destroying session from store:', storeErr);
          }
        });
      }

      res.clearCookie('connect.sid');
      res.json(createSuccessResponse('Logged out successfully'));
    });
  }
}
