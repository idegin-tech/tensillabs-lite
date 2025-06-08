import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './services/transaction.service';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { AuthModule } from '../../auth/auth.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    forwardRef(() => WorkspaceMembersModule),
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [MongooseModule, TransactionService],
})
export class TransactionsModule {}
