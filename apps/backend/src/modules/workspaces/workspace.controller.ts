import { Controller, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './services/workspace.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('workspaces')
@UseGuards(AuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  // Workspace creation removed - workspaces are now created via APP_KEY seeding only
}
