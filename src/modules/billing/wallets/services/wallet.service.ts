import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet, Currency } from '../schemas/wallet.schema';
import { TransactionService } from '../../transactions/services/transaction.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private transactionService: TransactionService,
  ) {}

  async initializeWallet(
    workspaceId: string,
    currency: Currency = Currency.USD,
  ): Promise<Wallet> {
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const wallet = this.walletRepository.create({
      workspaceId,
      currentBalance: 0,
      currency,
      nextBillingDate,
      tier: 0,
    });

    return await this.walletRepository.save(wallet);
  }

  async getWalletWithRecentTransactions(workspaceId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { workspaceId },
      relations: ['workspace'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const recentTransactions = await this.transactionService.findRecentByWallet(
      wallet.id,
      5,
    );

    return {
      wallet,
      recentTransactions,
    };
  }
}
