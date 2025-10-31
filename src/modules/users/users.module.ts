import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSecretsService } from './services/user-secrets.service';
import { User } from './schemas/user.schema';
import { UserSecrets } from './schemas/user-secrets.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSecrets]),
  ],
  providers: [UserSecretsService],
  exports: [TypeOrmModule, UserSecretsService],
})
export class UsersModule {}
