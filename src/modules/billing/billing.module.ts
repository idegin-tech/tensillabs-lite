import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [TransactionsModule, WalletsModule],
  exports: [TransactionsModule, WalletsModule],
})
export class BillingModule {}
