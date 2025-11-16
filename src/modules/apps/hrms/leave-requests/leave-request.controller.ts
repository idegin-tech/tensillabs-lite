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
import { LeaveRequestService } from './services/leave-request.service';
import { CommentService } from '../../../comments/services/comment.service';
import { FileService } from '../../../files/services/file.service';
import { UploadService } from '../../../../lib/upload.lib';
import {
    createLeaveRequestSchema,
    CreateLeaveRequestDto,
    updateLeaveRequestSchema,
    UpdateLeaveRequestDto,
    approveLeaveRequestSchema,
    ApproveLeaveRequestDto,
    rejectLeaveRequestSchema,
    RejectLeaveRequestDto,
} from './dto/leave-request.dto';
import {
    createCommentSchema,
    CreateCommentDto,
    updateCommentSchema,
    UpdateCommentDto,
} from '../../../comments/dto/comment.dto';
import { HrmsUserPermission } from '../hrms-user/hrms-user.schema';
import { LeaveStatus } from './schemas/leave-request.schema';

interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

@Controller('leave-requests')
@UseGuards(AuthGuard, WorkspaceMemberGuard)
export class LeaveRequestController {
    constructor(
        private readonly leaveRequestService: LeaveRequestService,
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
    async createLeaveRequest(
        @Body(new ZodValidationPipe(createLeaveRequestSchema))
        createLeaveRequestDto: CreateLeaveRequestDto,
        @UploadedFiles() files: UploadedFile[],
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const leaveRequest = await this.leaveRequestService.create(
            createLeaveRequestDto,
            req.workspaceMember.id,
            req.workspace.id,
        );

        let uploadedFiles = [];
        if (files && files.length > 0) {
            const uploadPath = `/workspaces/${req.workspace.id}/leave-requests/${leaveRequest.id}`;

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
                        leaveRequestId: leaveRequest.id,
                    },
                    req.workspace.id,
                    req.workspaceMember.id,
                );
                uploadedFiles.push(savedFile);
            }
        }

        return createSuccessResponse(
            'Leave request created successfully',
            {
                leaveRequest,
                files: uploadedFiles,
            },
        );
    }

    @Get()
    @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
    async getAllLeaveRequests(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('status') status: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 20;
        const leaveStatus = status as LeaveStatus | undefined;

        const result = await this.leaveRequestService.findAll(
            req.workspace.id,
            pageNumber,
            limitNumber,
            leaveStatus,
        );

        return createSuccessResponse(
            'Leave requests retrieved successfully',
            result,
        );
    }

    @Get('me')
    async getMyLeaveRequests(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('status') status: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 20;
        const leaveStatus = status as LeaveStatus | undefined;

        const result = await this.leaveRequestService.findByMember(
            req.workspaceMember.id,
            req.workspace.id,
            pageNumber,
            limitNumber,
            leaveStatus,
        );

        return createSuccessResponse(
            'Your leave requests retrieved successfully',
            result,
        );
    }

    @Get(':id')
    async getLeaveRequestById(
        @Param('id') id: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const leaveRequest = await this.leaveRequestService.findOne(
            id,
            req.workspace.id,
        );

        return createSuccessResponse(
            'Leave request retrieved successfully',
            leaveRequest,
        );
    }

    @Put(':id')
    async updateLeaveRequest(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateLeaveRequestSchema))
        updateLeaveRequestDto: UpdateLeaveRequestDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const leaveRequest = await this.leaveRequestService.update(
            id,
            updateLeaveRequestDto,
            req.workspaceMember.id,
            req.workspace.id,
        );

        return createSuccessResponse(
            'Leave request updated successfully',
            leaveRequest,
        );
    }

    @Delete(':id')
    async deleteLeaveRequest(
        @Param('id') id: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        await this.leaveRequestService.delete(
            id,
            req.workspaceMember.id,
            req.workspace.id,
        );

        return createSuccessResponse('Leave request deleted successfully', null);
    }

    @Patch(':id/approve')
    @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
    async approveLeaveRequest(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(approveLeaveRequestSchema))
        approveDto: ApproveLeaveRequestDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const leaveRequest = await this.leaveRequestService.approve(
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
                leaveRequest.id,
            );
        }

        return createSuccessResponse(
            'Leave request approved successfully',
            leaveRequest,
        );
    }

    @Patch(':id/reject')
    @UseGuards(validateHRMSUser([HrmsUserPermission.ADMIN, HrmsUserPermission.MANAGER]))
    async rejectLeaveRequest(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(rejectLeaveRequestSchema))
        rejectDto: RejectLeaveRequestDto,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const leaveRequest = await this.leaveRequestService.reject(
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
            leaveRequest.id,
        );

        return createSuccessResponse(
            'Leave request rejected successfully',
            leaveRequest,
        );
    }

    @Get(':id/comments')
    async getLeaveRequestComments(
        @Param('id') id: string,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        await this.leaveRequestService.findOne(id, req.workspace.id);

        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 20;

        const result = await this.commentService.getLeaveRequestComments(
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
        await this.leaveRequestService.findOne(id, req.workspace.id);

        const comment = await this.commentService.create(
            createCommentDto,
            req.workspace.id,
            req.workspaceMember.id,
            null,
            null,
            null,
            id,
        );

        let uploadedFiles = [];
        if (files && files.length > 0) {
            const uploadPath = `/leave-requests/${id}/comments/${comment.id}`;

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
        await this.leaveRequestService.findOne(id, req.workspace.id);

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
        await this.leaveRequestService.findOne(id, req.workspace.id);

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
    async uploadLeaveRequestFiles(
        @Param('id') id: string,
        @UploadedFiles() files: UploadedFile[],
        @Req() req: Request & { workspaceMember: any; workspace: any },
    ) {
        const leaveRequest = await this.leaveRequestService.findOne(
            id,
            req.workspace.id,
        );

        if (leaveRequest.memberId !== req.workspaceMember.id) {
            throw new ForbiddenException(
                'You can only upload files to your own leave requests',
            );
        }

        if (!files || files.length === 0) {
            throw new ForbiddenException('No files provided');
        }

        const uploadPath = `/workspaces/${req.workspace.id}/leave-requests/${id}`;

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
                    leaveRequestId: id,
                },
                req.workspace.id,
                req.workspaceMember.id,
            );
            savedFiles.push(savedFile);
        }

        return createSuccessResponse('Files uploaded successfully', savedFiles);
    }
}
