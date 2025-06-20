import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type SpaceParticipantDocument = SpaceParticipant & Document;

export enum SpacePermission {
  ADMIN = 'admin',
  REGULAR = 'regular',
}

export enum ParticipantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({
  timestamps: true,
  collection: 'space_participants',
})
export class SpaceParticipant {
  @Prop({
    type: Types.ObjectId,
    ref: 'WorkspaceMember',
    required: true,
  })
  member: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Space',
    required: true,
  })
  space: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(SpacePermission),
    required: true,
    default: SpacePermission.REGULAR,
  })
  permissions: SpacePermission;

  @Prop({
    type: String,
    enum: Object.values(ParticipantStatus),
    required: true,
    default: ParticipantStatus.ACTIVE,
  })
  status: ParticipantStatus;
}

export const SpaceParticipantSchema =
  SchemaFactory.createForClass(SpaceParticipant);

SpaceParticipantSchema.index({ space: 1 });
SpaceParticipantSchema.index({ member: 1 });
SpaceParticipantSchema.index({ workspace: 1 });
SpaceParticipantSchema.index({ status: 1 });
SpaceParticipantSchema.index({ member: 1, space: 1 }, { unique: true });

SpaceParticipantSchema.plugin(mongoosePaginate);
