import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './services/wallet.service';
import { Wallet } from './schemas/wallet.schema';
import { TransactionsModule } from '../transactions/transactions.module';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { AuthModule } from '../../auth/auth.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    forwardRef(() => TransactionsModule),
    forwardRef(() => WorkspaceMembersModule),
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [TypeOrmModule, WalletService],
})
export class WalletsModule {}
