import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Body,
    Param,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
    ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { WorkspaceMemberGuard } from '../../../workspace-members/guards/workspace-member.guard';
import { validateHRMSUser } from '../hrms-user/guards/hrms-user.guard';
import { createSuccessResponse } from '../../../../lib/response.interface';
import { ZodValidationPipe } from '../../../../lib/validation.pipe';
import { TimeOffRequestService } from './services/time-off-request.service';
import { CommentService } from '../../../comments/services/comment.service';
import { FileService } from '../../../files/services/file.service';
import { UploadService } from '../../../../lib/upload.lib';
import {
    createTimeOffRequestSchema,
    CreateTimeOffRequestDto,
    updateTimeOffRequestSchema,
    UpdateTimeOffRequestDto,
    approveTimeOffRequestSchema,
    ApproveTimeOffRequestDto,
    rejectTimeOffRequestSchema,
    RejectTimeOffRequestDto,
} from './dto/time-off-request.dto';
import {
    createCommentSchema,
    CreateCommentDto,
    updateCommentSchema,
    UpdateCommentDto,
} from '../../../comments/dto/comment.dto';
import { HrmsUserPermission } from '../hrms-user/hrms-user.schema';

interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

@Controller('time-off-requests')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class TimeOffRequestController {
    constructor(
        private readonly timeOffRequestService: TimeOffRequestService,
        private readonly commentService: CommentService,
        private readonly fileService: FileService,
        private readonly uploadService: UploadService,
    ) { }

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
        }),
    )
    async createTimeOffRequest(
        @Body(new ZodValidationPipe(createTimeOffRequestSchema))
        createTimeOffRequestDto: CreateTimeOffRequestDto,
        @UploadedFiles() files: UploadedFile[],
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const timeOffRequest = await this.timeOffRequestService.create(
            createTimeOffRequestDto,
            req.workspaceMember.id,
            req.workspace.id,
        );

        let uploadedFiles = [];
        if (files && files.length > 0) {
            const uploadPath = `/workspace/apps/hrms/time-off-requests/${timeOffRequest.id}`;

            const uploadResults = await this.uploadService.uploadFiles(
                files,
                uploadPath,
                String(req.workspace.id),
            );

            for (const uploadResult of uploadResults) {
                const savedFile = await this.fileService.create(
                    {
                        name: uploadResult.originalName,
                        size: uploadResult.bytes,
                        mimeType: uploadResult.mimeType,
                        fileURL: uploadResult.secureUrl,
                        fileKey: uploadResult.publicId,
                        timeOffRequestId: timeOffRequest.id,
                    },
                    req.workspace.id,
                    req.workspaceMember.id,
                );
                uploadedFiles.push(savedFile);
            }
        }

        return createSuccessResponse(
            'Time off request created successfully',
            {
                timeOffRequest,
                files: uploadedFiles,
            },
        );
    }

    @Get()
    @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
    async getAllTimeOffRequests(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 20;

        const result = await this.timeOffRequestService.findAll(
            req.workspace.id,
            pageNumber,
            limitNumber,
        );

        return createSuccessResponse(
            'Time off requests retrieved successfully',
            result,
        );
    }

    @Get('me')
    async getMyTimeOffRequests(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 20;

        const result = await this.timeOffRequestService.findByMember(
            req.workspaceMember.id,
            req.workspace.id,
            pageNumber,
            limitNumber,
        );

        return createSuccessResponse(
            'Your time off requests retrieved successfully',
            result,
        );
    }

    @Get(':id')
    async getTimeOffRequestById(
        @Param('id') id: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const timeOffRequest = await this.timeOffRequestService.findOne(
            id,
            req.workspace.id,
        );

        return createSuccessResponse(
            'Time off request retrieved successfully',
            timeOffRequest,
        );
    }

    @Put(':id')
    async updateTimeOffRequest(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateTimeOffRequestSchema))
        updateTimeOffRequestDto: UpdateTimeOffRequestDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const timeOffRequest = await this.timeOffRequestService.update(
            id,
            updateTimeOffRequestDto,
            req.workspace.id,
        );

        return createSuccessResponse(
            'Time off request updated successfully',
            timeOffRequest,
        );
    }

    @Delete(':id')
    async deleteTimeOffRequest(
        @Param('id') id: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        await this.timeOffRequestService.delete(
            id,
            req.workspace.id,
        );

        return createSuccessResponse('Time off request deleted successfully', null);
    }

    @Patch(':id/approve')
    @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
    async approveTimeOffRequest(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(approveTimeOffRequestSchema))
        approveDto: ApproveTimeOffRequestDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const timeOffRequest = await this.timeOffRequestService.approve(
            id,
            req.workspaceMember.id,
            req.workspace.id,
        );

        if (approveDto.note) {
            await this.commentService.create(
                { content: approveDto.note },
                req.workspace.id,
                req.workspaceMember.id,
                null,
                null,
                null,
                null,
                timeOffRequest.id,
            );
        }

        return createSuccessResponse(
            'Time off request approved successfully',
            timeOffRequest,
        );
    }

    @Patch(':id/reject')
    @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
    async rejectTimeOffRequest(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(rejectTimeOffRequestSchema))
        rejectDto: RejectTimeOffRequestDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const timeOffRequest = await this.timeOffRequestService.reject(
            id,
            req.workspaceMember.id,
            req.workspace.id,
        );

        await this.commentService.create(
            { content: rejectDto.note },
            req.workspace.id,
            req.workspaceMember.id,
            null,
            null,
            null,
            null,
            timeOffRequest.id,
        );

        return createSuccessResponse(
            'Time off request rejected successfully',
            timeOffRequest,
        );
    }

    @Get(':id/comments')
    async getTimeOffRequestComments(
        @Param('id') id: string,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        await this.timeOffRequestService.findOne(id, req.workspace.id);

        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 20;

        const result = await this.commentService.getTimeOffRequestComments(
            id,
            req.workspace.id,
            pageNumber,
            limitNumber,
        );

        return createSuccessResponse('Comments retrieved successfully', result);
    }

    @Post(':id/comments')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
        }),
    )
    async createComment(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(createCommentSchema))
        createCommentDto: CreateCommentDto,
        @UploadedFiles() files: UploadedFile[],
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        await this.timeOffRequestService.findOne(id, req.workspace.id);

        const comment = await this.commentService.create(
            createCommentDto,
            req.workspace.id,
            req.workspaceMember.id,
            null,
            null,
            null,
            null,
            id,
        );

        let uploadedFiles = [];
        if (files && files.length > 0) {
            const uploadPath = `/time-off-requests/${id}/comments/${comment.id}`;

            const uploadResults = await this.uploadService.uploadFiles(
                files,
                uploadPath,
                String(req.workspace.id),
            );

            for (const uploadResult of uploadResults) {
                const savedFile = await this.fileService.create(
                    {
                        name: uploadResult.originalName,
                        size: uploadResult.bytes,
                        mimeType: uploadResult.mimeType,
                        fileURL: uploadResult.secureUrl,
                        fileKey: uploadResult.publicId,
                        commentId: comment.id,
                    },
                    req.workspace.id,
                    req.workspaceMember.id,
                );
                uploadedFiles.push(savedFile);
            }
        }

        return createSuccessResponse('Comment created successfully', {
            comment,
            files: uploadedFiles,
        });
    }

    @Put(':id/comments/:commentId')
    async updateComment(
        @Param('id') id: string,
        @Param('commentId') commentId: string,
        @Body(new ZodValidationPipe(updateCommentSchema))
        updateCommentDto: UpdateCommentDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        await this.timeOffRequestService.findOne(id, req.workspace.id);

        const comment = await this.commentService.update(
            commentId,
            updateCommentDto,
            req.workspace.id,
        );

        return createSuccessResponse('Comment updated successfully', comment);
    }

    @Delete(':id/comments/:commentId')
    async deleteComment(
        @Param('id') id: string,
        @Param('commentId') commentId: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        await this.timeOffRequestService.findOne(id, req.workspace.id);

        const comment = await this.commentService.delete(
            commentId,
            req.workspace.id,
        );

        return createSuccessResponse('Comment deleted successfully', comment);
    }

    @Post(':id/files')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
        }),
    )
    async uploadTimeOffRequestFiles(
        @Param('id') id: string,
        @UploadedFiles() files: UploadedFile[],
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const timeOffRequest = await this.timeOffRequestService.findOne(
            id,
            req.workspace.id,
        );

        if (timeOffRequest.memberId !== req.workspaceMember.id) {
            throw new ForbiddenException(
                'You can only upload files to your own time off requests',
            );
        }

        if (!files || files.length === 0) {
            throw new ForbiddenException('No files provided');
        }

        const uploadPath = `/workspaces/${req.workspace.id}/time-off-requests/${id}`;

        const uploadResults = await this.uploadService.uploadFiles(
            files,
            uploadPath,
            String(req.workspace.id),
        );

        const savedFiles = [];
        for (const uploadResult of uploadResults) {
            const savedFile = await this.fileService.create(
                {
                    name: uploadResult.originalName,
                    size: uploadResult.bytes,
                    mimeType: uploadResult.mimeType,
                    fileURL: uploadResult.secureUrl,
                    fileKey: uploadResult.publicId,
                    timeOffRequestId: id,
                },
                req.workspace.id,
                req.workspaceMember.id,
            );
            savedFiles.push(savedFile);
        }

        return createSuccessResponse('Files uploaded successfully', savedFiles);
    }
}
