import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './services/transaction.service';
import { Transaction } from './schemas/transaction.schema';
import { WorkspaceMembersModule } from '../../workspace-members/workspace-members.module';
import { AuthModule } from '../../auth/auth.module';
import { WorkspacesModule } from '../../workspaces/workspaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => WorkspaceMembersModule),
    forwardRef(() => WorkspacesModule),
    AuthModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TypeOrmModule, TransactionService],
})
export class TransactionsModule {}
