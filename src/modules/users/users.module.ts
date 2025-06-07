import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserSecrets, UserSecretsSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSecrets.name, schema: UserSecretsSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class UsersModule {}
