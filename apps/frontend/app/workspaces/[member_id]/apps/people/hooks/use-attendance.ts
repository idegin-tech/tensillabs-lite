import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import { Attendance } from '../types/hrms.types'
import { toast } from 'sonner'

interface ClockInResponse {
    success: boolean
    message: string
    payload: Attendance
}

interface ClockOutResponse {
    success: boolean
    message: string
    payload: Attendance
}

export function useClockIn() {
    const { member_id } = useCommon()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data?: { officeId?: string; remarks?: string }) => {
            const userDateTime = new Date().toISOString()
            const response = await api.post<ClockInResponse>('/hrms/attendance/clock-in', data || {}, {
                headers: {
                    'x-member-id': member_id,
                    'x-user-datetime': userDateTime,
                },
            })
            return response
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Clocked in successfully')
            queryClient.invalidateQueries({ queryKey: ['hrms-dependencies', member_id] })
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to clock in')
        }
    })
}

export function useClockOut() {
    const { member_id } = useCommon()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data?: { remarks?: string }) => {
            const userDateTime = new Date().toISOString()
            const response = await api.post<ClockOutResponse>('/hrms/attendance/clock-out', data || {}, {
                headers: {
                    'x-member-id': member_id,
                    'x-user-datetime': userDateTime,
                },
            })
            return response
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Clocked out successfully')
            queryClient.invalidateQueries({ queryKey: ['hrms-dependencies', member_id] })
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to clock out')
        }
    })
}
