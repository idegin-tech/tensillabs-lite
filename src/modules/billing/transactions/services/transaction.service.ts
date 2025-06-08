import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Types,
  PaginateModel,
  FilterQuery,
  PaginateResult,
} from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument> &
      PaginateModel<TransactionDocument>,
  ) {}

  async findByWorkspace(
    workspaceId: Types.ObjectId,
    pagination?: PaginationDto,
  ): Promise<PaginateResult<TransactionDocument>> {
    if (!pagination) {
      pagination = { page: 1, limit: 10, sortBy: '-createdAt' };
    }

    const { paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<TransactionDocument> = {
      workspace: workspaceId,
    };

    return await this.transactionModel.paginate(query, {
      ...paginationOptions,
      populate: [
        { path: 'workspace', select: 'name' },
        { path: 'wallet', select: 'currentBalance currency' },
      ],
    });
  }

  async findById(id: Types.ObjectId): Promise<TransactionDocument> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate([
        { path: 'workspace', select: 'name' },
        { path: 'wallet', select: 'currentBalance currency' },
      ])
      .exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async findRecentByWallet(
    walletId: Types.ObjectId,
    limit: number = 5,
  ): Promise<TransactionDocument[]> {
    return await this.transactionModel
      .find({ wallet: walletId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate([
        {
          path: 'workspace',
          select: 'name',
        },
        {
          path: 'wallet',
          select: 'currentBalance currency',
        },
      ])
      .exec();
  }
}
