import { WorkspaceMember } from '@/types/workspace.types'

export interface HrmsUser {
    _id: string
    memberId: string
    workspaceId: string
    permission: string
    createdAt: string
    updatedAt: string
}

export interface Employee {
    _id: string
    memberId: string
    workspaceId: string
    firstName: string
    lastName: string
    middleName?: string
    employeeId: string
}

export enum AttendanceStatus {
    OPEN = 'open',
    CLOSED = 'closed'
}

export interface Attendance {
    id: string
    memberId: string
    workspaceId: string
    clockIn: string
    clockOut: string | null
    status: AttendanceStatus
    totalHours: number | null
    createdAt: string
    updatedAt: string
}

export enum LeaveType {
    ANNUAL = 'annual',
    SICK = 'sick',
    CASUAL = 'casual',
    MATERNITY = 'maternity',
    PATERNITY = 'paternity',
    UNPAID = 'unpaid',
    OTHER = 'other'
}

export enum LeaveStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    WITHDRAWN = 'withdrawn'
}

export interface LeaveRequest {
    id: string
    employeeId: string
    employee?: Employee
    memberId: string
    member?: WorkspaceMember
    workspaceId: string
    type: LeaveType
    startDate: string
    endDate: string
    reason?: string
    status: LeaveStatus
    approvedById?: string
    approvedBy?: WorkspaceMember
    approvedAt?: string
    rejectedById?: string
    rejectedBy?: WorkspaceMember
    rejectedAt?: string
    createdAt: string
    updatedAt: string
}

export enum TimeOffType {
    PERSONAL = 'personal',
    FAMILY_EMERGENCY = 'family_emergency',
    MEDICAL_APPOINTMENT = 'medical_appointment',
    BEREAVEMENT = 'bereavement',
    RELIGIOUS_OBSERVANCE = 'religious_observance',
    JURY_DUTY = 'jury_duty',
    MILITARY_LEAVE = 'military_leave',
    OTHER = 'other'
}

export enum TimeOffStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    WITHDRAWN = 'withdrawn'
}

export interface TimeOffRequest {
    id: string
    employeeId: string
    employee?: Employee
    memberId: string
    member?: WorkspaceMember
    workspaceId: string
    type: TimeOffType
    startDate: string
    endDate: string
    reason?: string
    coverById?: string
    coverBy?: WorkspaceMember
    status: TimeOffStatus
    approvedById?: string
    approvedBy?: WorkspaceMember
    approvedAt?: string
    rejectedById?: string
    rejectedBy?: WorkspaceMember
    rejectedAt?: string
    createdAt: string
    updatedAt: string
}

export interface HrmsSettings {
    _id: string
    workspaceId: string
    organizationOpenTime: string
    organizationCloseTime: string
    workHoursPerDay: number
    createdAt: string
    updatedAt: string
}
