import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSecretsService } from './services/user-secrets.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserSecrets, UserSecretsSchema } from './schemas/user-secrets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSecrets.name, schema: UserSecretsSchema },
    ]),
  ],
  providers: [UserSecretsService],
  exports: [MongooseModule, UserSecretsService],
})
export class UsersModule {}
