import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmployeeDocument = Employee & Document;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
}

export enum EmploymentType {
  PERMANENT = 'permanent',
  CONTRACT = 'contract',
  INTERN = 'intern',
  TEMPORARY = 'temporary',
  PART_TIME = 'part_time',
  CONSULTANT = 'consultant',
}

export enum Religion {
  CHRISTIANITY = 'christianity',
  ISLAM = 'islam',
  TRADITIONAL = 'traditional',
  OTHER = 'other',
  NONE = 'none',
}

@Schema({
  timestamps: true,
  collection: 'employees',
})
export class Employee {
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
    required: true,
    trim: true,
    maxlength: 50,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  lastName: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 50,
    default: null,
  })
  middleName: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 200,
    default: null,
  })
  address: string;

  @Prop({
    type: [
      {
        name: { type: String, required: true, maxlength: 100 },
        phone: { type: String, required: true, maxlength: 20 },
        address: { type: String, required: false, maxlength: 200 },
        relationship: { type: String, required: true, maxlength: 50 },
        email: { type: String, required: false, maxlength: 100 },
        notes: { type: String, required: false, maxlength: 200 },
      },
    ],
    default: [],
  })
  emergencyContacts: Array<{
    name: string;
    phone: string;
    address?: string;
    relationship: string;
    email?: string;
    notes?: string;
  }>;

  @Prop({
    type: String,
    enum: Gender,
    required: false,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  dateOfBirth: Date;

  //Todo: use nationality npm package
  @Prop({
    type: String,
    required: false,
    maxlength: 100,
    default: null,
  })
  nationality: string;

  //Todo: add the 36 states of Nigeria and FCT
  @Prop({
    type: String,
    required: false,
    maxlength: 100,
    default: null,
  })
  stateOfOrigin: string;

  @Prop({
    type: String,
    enum: MaritalStatus,
    required: false,
    // default: MaritalStatus.SINGLE,
    default: null
  })
  maritalStatus: MaritalStatus;

  @Prop({
    type: String,
    enum: Religion,
    required: false,
    // default: Religion.NONE,
    default: null,
  })
  religion: Religion;

  @Prop({
    type: String,
    maxlength: 20,
    required: false,
    default: null,
  })
  nin: string;

  @Prop({
    type: String,
    enum: EmploymentType,
    required: false,
    default: EmploymentType.PERMANENT,
  })
  employmentType: EmploymentType;

  @Prop({
    type: String,
    maxlength: 50,
    required: false,
    default: null,
    unique: true,
    sparse: true,
  })
  employeeId: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
EmployeeSchema.index({ member: 1, workspace: 1 }, { unique: true });
