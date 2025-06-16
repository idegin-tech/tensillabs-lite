import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';

interface SessionData {
  userId?: string;
  userEmail?: string;
}

interface AuthenticatedRequest extends Request {
  session: Request['session'] & SessionData;
  user?: UserDocument;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = request.session;

    if (!session || !session.userId) {
      console.log('[DEBUG] Auth Guard - No active session found');
      throw new UnauthorizedException('No active session found');
    }

    try {
      const user = await this.userModel.findById(session.userId);

      if (!user) {
        console.log(
          '[DEBUG] Auth Guard - User not found for ID:',
          session.userId,
        );
        session.destroy(() => {});
        throw new UnauthorizedException('User not found');
      }

      if (!user.isEmailVerified) {
        console.log(
          '[DEBUG] Auth Guard - Email not verified for user:',
          user.email,
        );
        throw new UnauthorizedException('Email not verified');
      }

      request.user = user;

      if (typeof session.touch === 'function') {
        session.touch();
      }

      return true;
    } catch (error) {
      console.log('[DEBUG] Auth Guard - Error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
