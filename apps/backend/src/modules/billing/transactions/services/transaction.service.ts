import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../schemas/transaction.schema';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findByWorkspace(workspaceId: string, pagination?: PaginationDto): Promise<any> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { paginationOptions } = extractPaginationOptions(pagination);

    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    queryBuilder.where({ workspaceId });
    queryBuilder.leftJoinAndSelect('transaction.workspace', 'workspace');
    queryBuilder.leftJoinAndSelect('transaction.wallet', 'wallet');
    queryBuilder.select([
      'transaction',
      'workspace.id',
      'workspace.name',
      'wallet.id',
      'wallet.currentBalance',
      'wallet.currency',
    ]);

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    if (paginationOptions.sort) {
      const sortOrder = paginationOptions.sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = paginationOptions.sort.replace('-', '');
      queryBuilder.orderBy(`transaction.${sortField}`, sortOrder);
    }

    const [docs, totalDocs] = await queryBuilder.getManyAndCount();

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page < Math.ceil(totalDocs / limit),
      hasPrevPage: page > 1,
      nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }

  async findById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['workspace', 'wallet'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async findRecentByWallet(
    walletId: string,
    limit: number = 5,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { walletId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['workspace', 'wallet'],
    });
  }
}
