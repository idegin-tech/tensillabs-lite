import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletController } from './wallet.controller';
import { WalletService } from './services/wallet.service';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { TransactionsModule } from '../transactions/transactions.module';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { AuthModule } from '../../auth/auth.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    forwardRef(() => TransactionsModule),
    forwardRef(() => WorkspaceMembersModule),
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [MongooseModule, WalletService],
})
export class WalletsModule {}
