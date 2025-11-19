import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { TransactionService } from './services/transaction.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { WorkspaceMemberGuard } from '../../workspace-members/guards/workspace-member.guard';
import { createSuccessResponse } from '../../../lib/response.interface';
import { ZodValidationPipe } from '../../../lib/validation.pipe';
import {
  paginationSchema,
  PaginationDto,
} from '../../workspace-members/dto/pagination.dto';

@Controller('billing/transactions')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseGuards(WorkspaceMemberGuard)
  async getWorkspaceTransactions(
    @Query(new ZodValidationPipe(paginationSchema)) pagination: PaginationDto,
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const transactions = await this.transactionService.findByWorkspace(
      req.workspace.id,
      pagination,
    );

    return createSuccessResponse(
      'Transactions retrieved successfully',
      transactions,
    );
  }

  @Get(':id')
  @UseGuards(WorkspaceMemberGuard)
  async getTransactionById(@Param('id') id: string) {
    const transaction = await this.transactionService.findById(id);

    return createSuccessResponse(
      'Transaction retrieved successfully',
      transaction,
    );
  }
}
