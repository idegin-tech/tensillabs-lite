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

export interface Attendance {
    _id: string
    memberId: string
    workspaceId: string
    clockIn: string
    clockOut?: string
    status: 'open' | 'closed'
    totalHours?: number
    isLate: boolean
    isEarlyLeave: boolean
    remarks?: string
}

export interface LeaveRequest {
    _id: string
    memberId: string
    type: string
    startDate: string
    endDate: string
    status: string
}

export interface TimeOffRequest {
    _id: string
    memberId: string
    type: string
    startDate: string
    endDate: string
    status: string
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
