import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Types,
  PaginateModel,
  FilterQuery,
  PaginateResult,
} from 'mongoose';
import { Office, OfficeDocument } from '../schemas/office.schema';
import { CreateOfficeDto, UpdateOfficeDto } from '../dto/office.dto';
import {
  PaginationDto,
  extractPaginationOptions,
} from '../../../workspace-members/dto/pagination.dto';

@Injectable()
export class OfficeService {
  constructor(
    @InjectModel(Office.name)
    private officeModel: Model<OfficeDocument> & PaginateModel<OfficeDocument>,
  ) {}

  async create(
    createOfficeDto: CreateOfficeDto,
    workspaceId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ): Promise<OfficeDocument> {
    const office = new this.officeModel({
      ...createOfficeDto,
      workspace: workspaceId,
      createdBy,
    });

    return await office.save();
  }

  async findAll(
    workspaceId: Types.ObjectId,
    pagination: PaginationDto,
  ): Promise<PaginateResult<OfficeDocument>> {
    const { search, paginationOptions } = extractPaginationOptions(pagination);

    const query: FilterQuery<OfficeDocument> = {
      workspace: workspaceId,
      isDeleted: false,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    if (pagination.isActive && pagination.isActive !== 'all') {
      query.isActive = pagination.isActive === 'true';
    }

    return await this.officeModel.paginate(query, {
      ...paginationOptions,
      populate: 'createdBy',
    });
  }

  async findById(id: Types.ObjectId): Promise<OfficeDocument> {
    const office = await this.officeModel.findById(id).exec();
    if (!office || office.isDeleted) {
      throw new NotFoundException('Office not found');
    }
    return office;
  }

  async update(
    id: Types.ObjectId,
    updateOfficeDto: UpdateOfficeDto,
    workspaceId: Types.ObjectId,
  ): Promise<OfficeDocument> {
    const office = await this.officeModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        updateOfficeDto,
        { new: true },
      )
      .populate('createdBy')
      .exec();

    if (!office) {
      throw new NotFoundException('Office not found');
    }

    return office;
  }

  async moveToTrash(
    id: Types.ObjectId,
    workspaceId: Types.ObjectId,
  ): Promise<OfficeDocument> {
    const office = await this.officeModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .exec();

    if (!office) {
      throw new NotFoundException('Office not found');
    }

    return office;
  }

  async toggleActive(
    id: Types.ObjectId,
    isActive: boolean,
    workspaceId: Types.ObjectId,
  ): Promise<OfficeDocument> {
    const office = await this.officeModel
      .findOneAndUpdate(
        { _id: id, workspace: workspaceId, isDeleted: false },
        { isActive },
        { new: true },
      )
      .populate('createdBy')
      .exec();

    if (!office) {
      throw new NotFoundException('Office not found');
    }

    return office;
  }
}
