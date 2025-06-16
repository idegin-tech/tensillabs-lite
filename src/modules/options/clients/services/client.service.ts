/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Types,
  PaginateModel,
  FilterQuery,
  PaginateResult,
} from 'mongoose';
import { Client, ClientDocument } from '../schemas/client.schema';
import { CreateClientDto, UpdateClientDto } from '../dto/client.dto';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument> & PaginateModel<ClientDocument>,
  ) {}

  async create(
    createClientDto: CreateClientDto,
    workspaceId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ): Promise<ClientDocument> {
    const client = new this.clientModel({
      ...createClientDto,
      workspace: workspaceId,
      createdBy,
      offices:
        createClientDto.offices?.map((id) => new Types.ObjectId(id)) || [],
    });

    return await client.save();
  }

  async findAll(
    workspaceId: Types.ObjectId,
    pagination: PaginationDto,
  ): Promise<PaginateResult<ClientDocument>> {
    const { search, isActive, paginationOptions } =
      extractPaginationOptions(pagination);

    const query: FilterQuery<ClientDocument> = {
      workspace: workspaceId,
      isDeleted: false,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive && isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    return await this.clientModel.paginate(query, {
      ...paginationOptions,
      populate: ['createdBy', 'offices'],
    });
  }

  async findById(id: Types.ObjectId): Promise<ClientDocument> {
    const client = await this.clientModel
      .findById(id)
      .populate('offices')
      .exec();
    if (!client || client.isDeleted) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async update(
    id: Types.ObjectId,
    updateClientDto: UpdateClientDto,
    workspaceId: Types.ObjectId,
  ): Promise<ClientDocument> {
    const updateData: Record<string, any> = { ...updateClientDto };

    if (updateClientDto.offices) {
      updateData.offices = updateClientDto.offices.map(
        (officeId) => new Types.ObjectId(officeId),
      );
    }

    const client = await this.clientModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        updateData,
        { new: true },
      )
      .populate(['createdBy', 'offices'])
      .exec();

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async moveToTrash(
    id: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<ClientDocument> {
    const client = await this.clientModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .exec();

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async toggleActive(
    id: Types.ObjectId,
    isActive: boolean,
    workspaceId: Types.ObjectId,
  ): Promise<ClientDocument> {
    const client = await this.clientModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        { isActive },
        { new: true },
      )
      .populate(['createdBy', 'offices'])
      .exec();

    if (!client || client.isDeleted) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }
}
