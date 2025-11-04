import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { TimeEntryService } from './services/time-entry.service';
import {
    CreateTimeEntryDto,
    ResumeTimeEntryDto,
    UpdateTimeEntryDto,
    DeleteTimeEntriesDto,
    GetTimeEntriesQueryDto,
    createTimeEntrySchema,
    resumeTimeEntrySchema,
    updateTimeEntrySchema,
    deleteTimeEntriesSchema,
    getTimeEntriesQuerySchema,
} from './dto/time-entry.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import {
    WorkspaceMemberGuard,
    RequirePermission,
} from '../../workspace-members/guards/workspace-member.guard';
import { MemberPermissions } from '../../workspace-members/enums/member-permissions.enum';
import { ZodValidationPipe } from '../../../lib/validation.pipe';
import { createSuccessResponse } from '../../../lib/response.interface';

@Controller('time-entries')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
@RequirePermission(MemberPermissions.REGULAR)
export class TimeEntryController {
    constructor(private readonly timeEntryService: TimeEntryService) { }

    @Post()
    async createTimeEntry(
        @Body(new ZodValidationPipe(createTimeEntrySchema))
        createTimeEntryDto: CreateTimeEntryDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const entry = await this.timeEntryService.createTimeEntry(
            createTimeEntryDto,
            req.workspace.id,
            req.workspaceMember.id,
        );

        return createSuccessResponse('Time entry created successfully', entry);
    }

    @Post(':entryId/resume')
    async resumeTimeEntry(
        @Param('entryId') entryId: string,
        @Body(new ZodValidationPipe(resumeTimeEntrySchema))
        resumeTimeEntryDto: ResumeTimeEntryDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const entry = await this.timeEntryService.resumeTimeEntry(
            entryId,
            resumeTimeEntryDto,
            req.workspace.id,
            req.workspaceMember.id,
        );

        return createSuccessResponse('Time entry resumed successfully', entry);
    }

    @Get()
    async getTimeEntries(
        @Query(new ZodValidationPipe(getTimeEntriesQuerySchema))
        queryParams: GetTimeEntriesQueryDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const result = await this.timeEntryService.getTimeEntries(
            req.workspace.id,
            req.workspaceMember.id,
            queryParams,
        );

        return createSuccessResponse('Time entries retrieved successfully', result);
    }

    @Get(':entryId')
    async getTimeEntryById(
        @Param('entryId') entryId: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const entry = await this.timeEntryService.getTimeEntryById(
            entryId,
            req.workspace.id,
            req.workspaceMember.id,
        );

        return createSuccessResponse('Time entry retrieved successfully', entry);
    }

    @Put('bulk')
    async bulkUpdateTimeEntries(
        @Body(new ZodValidationPipe(updateTimeEntrySchema))
        updateTimeEntryDto: UpdateTimeEntryDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const entries = await this.timeEntryService.bulkUpdateTimeEntries(
            updateTimeEntryDto,
            req.workspace.id,
            req.workspaceMember.id,
        );

        return createSuccessResponse(
            'Time entries updated successfully',
            { entries, count: entries.length },
        );
    }

    @Delete('bulk')
    async bulkDeleteTimeEntries(
        @Body(new ZodValidationPipe(deleteTimeEntriesSchema))
        deleteTimeEntriesDto: DeleteTimeEntriesDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const result = await this.timeEntryService.bulkDeleteTimeEntries(
            deleteTimeEntriesDto,
            req.workspace.id,
            req.workspaceMember.id,
        );

        return createSuccessResponse('Time entries deleted successfully', result);
    }
}
