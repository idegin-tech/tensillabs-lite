import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkspaceService } from './services/workspace.service';
import { ZodValidationPipe } from '../../lib/validation.pipe';
import { createSuccessResponse } from '../../lib/response.interface';
import { createWorkspaceSchema, CreateWorkspaceDto } from './dto/workspace.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('workspaces')
@UseGuards(AuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @Body(new ZodValidationPipe(createWorkspaceSchema))
    createWorkspaceDto: CreateWorkspaceDto,
    @CurrentUser() user: UserDocument,
  ) {
    const result = await this.workspaceService.createWorkspace(
      createWorkspaceDto,
      user,
    );

    return createSuccessResponse('Workspace created successfully', {
      workspace: {
        id: result.workspace._id,
        name: result.workspace.name,
      },
    });
  }
}
