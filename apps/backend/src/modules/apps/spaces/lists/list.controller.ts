/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ListService } from './services/list.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { WorkspaceMemberGuard } from '../../../workspace-members/guards/workspace-member.guard';
import { SpaceParticipationGuard } from '../guards/space-participation.guard';
import { createSuccessResponse } from '../../../../lib/response.interface';
import { ZodValidationPipe } from '../../../../lib/validation.pipe';
import { 
  createListSchema, 
  CreateListDto,
  manageTagsSchema,
  ManageTagsDto,
} from './dto/list.dto';
import {
  getListFilesQuerySchema,
  GetListFilesQueryDto,
} from './dto/list-files.dto';

@Controller('lists')
@UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':listId')
  @UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
  async getListDetails(
    @Param('listId') listId: string,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const list = await this.listService.getListDetails(
      listId,
      req.workspace.id,
    );
    return createSuccessResponse('List details retrieved successfully', list);
  }

  @Get(':listId/files')
  @UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
  async getListFiles(
    @Param('listId') listId: string,
    @Query(new ZodValidationPipe(getListFilesQuerySchema))
    query: GetListFilesQueryDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const result = await this.listService.getListFiles(
      listId,
      req.workspace.id,
      query,
    );
    return createSuccessResponse(
      'List files retrieved successfully',
      result,
    );
  }

  @Put(':listId/tags')
  @UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
  async updateListTags(
    @Param('listId') listId: string,
    @Body() body: { tags: any[] },
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const list = await this.listService.updateTags(
      listId,
      req.workspace.id,
      body.tags,
    );
    return createSuccessResponse('Tags updated successfully', list);
  }

  @Put(':listId/tags/manage')
  @UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
  async manageListTags(
    @Param('listId') listId: string,
    @Body(new ZodValidationPipe(manageTagsSchema))
    manageTagsDto: ManageTagsDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
    },
  ) {
    const list = await this.listService.manageTags(
      listId,
      req.workspace.id,
      manageTagsDto,
    );
    return createSuccessResponse('Tags managed successfully', list);
  }
}

@Controller('spaces/:spaceId/lists')
@UseGuards(AuthGuard, WorkspaceMemberGuard, SpaceParticipationGuard)
export class SpaceListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async createList(
    @Param('spaceId') spaceId: string,
    @Body(new ZodValidationPipe(createListSchema))
    createListDto: CreateListDto,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
    },
  ) {
    const list = await this.listService.create(
      createListDto,
      spaceId,
      req.workspace.id,
    );

    return createSuccessResponse('List created successfully', list);
  }

  @Get()
  async getListsBySpace(
    @Param('spaceId') spaceId: string,
    @Req()
    req: Request & {
      workspaceMember: any;
      workspace: any;
      space: any;
    },
  ) {
    const lists = await this.listService.getListsBySpace(
      spaceId,
      req.workspace.id,
    );

    return createSuccessResponse('Lists retrieved successfully', lists);
  }
}
