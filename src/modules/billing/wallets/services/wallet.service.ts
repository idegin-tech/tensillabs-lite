import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument, Currency } from '../schemas/wallet.schema';
import { TransactionService } from '../../transactions/services/transaction.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    private transactionService: TransactionService,
  ) {}

  async initializeWallet(
    workspaceId: Types.ObjectId,
    currency: Currency = Currency.USD,
  ): Promise<WalletDocument> {
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const wallet = new this.walletModel({
      workspace: workspaceId,
      currentBalance: 0,
      currency,
      nextBillingDate,
      tier: 0,
    });

    return await wallet.save();
  }

  async getWalletWithRecentTransactions(workspaceId: Types.ObjectId) {
    const wallet = await this.walletModel
      .findOne({ workspace: workspaceId })
      .populate('workspace', 'name')
      .exec();

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const recentTransactions = await this.transactionService.findRecentByWallet(
      wallet._id as Types.ObjectId,
      5,
    );

    return {
      wallet,
      recentTransactions,
    };
  }
}
