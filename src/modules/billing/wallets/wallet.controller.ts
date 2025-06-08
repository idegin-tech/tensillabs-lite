/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { WalletService } from './services/wallet.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import {
  WorkspaceMemberGuard,
  RequirePermission,
} from '../../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../../workspace-members/enums/member-permissions.enum';
import { createSuccessResponse } from '../../../lib/response.interface';

@Controller('billing/wallets')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @UseGuards(WorkspaceMemberGuard)
  @RequirePermission(MemberPermissions.MANAGER)
  async getWalletData(
    @Req() req: Request & { workspaceMember: any; workspace: any },
  ) {
    const walletData = await this.walletService.getWalletWithRecentTransactions(
      req.workspace._id,
    );

    return createSuccessResponse(
      'Wallet data retrieved successfully',
      walletData,
    );
  }
}
