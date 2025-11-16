import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import { HrmsUser, Employee, Attendance, LeaveRequest, HrmsSettings, TimeOffRequest } from '../types/hrms.types'

interface GetDependenciesResponse {
    success: boolean
    message: string
    payload: {
        hrmsUser: HrmsUser | null
        employee: Employee | null
        openAttendance: Attendance | null
        leaveRequests: LeaveRequest[]
        recentAttendance: Attendance[]
        hrmsSettings: HrmsSettings | null
        totalAttendanceHours: number
        leaveBalance: number
        pendingLeaveRequest: LeaveRequest | null
        pendingTimeOffRequest: TimeOffRequest | null
    }
}

export function useHrmsDependencies() {
    const { member_id } = useCommon()

    return useQuery({
        queryKey: ['hrms-dependencies', member_id],
        queryFn: async () => {
            const response = await api.get<GetDependenciesResponse>('/hrms/dependencies', {
                headers: {
                    'x-member-id': member_id,
                },
            })
            return response
        },
        enabled: !!member_id,
        staleTime: 5 * 60 * 1000,
    })
}
