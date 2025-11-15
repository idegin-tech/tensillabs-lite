'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { HrmsUser, Employee, Attendance, LeaveRequest, HrmsSettings } from '../types/hrms.types'
import { useHrmsDependencies } from '../hooks/use-hrms'

interface PeopleState {
    isLoading: boolean
    error: Error | null
    hrmsUser: HrmsUser | null
    employee: Employee | null
    openAttendance: Attendance | null
    leaveRequests: LeaveRequest[]
    recentAttendance: Attendance[]
    hrmsSettings: HrmsSettings | null
    totalAttendanceHours: number
    leaveBalance: number
}

interface PeopleContextType {
    state: PeopleState
    updateState: (updates: Partial<PeopleState>) => void
    refetch: () => void
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined)

export function PeopleProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<PeopleState>({
        isLoading: true,
        error: null,
        hrmsUser: null,
        employee: null,
        openAttendance: null,
        leaveRequests: [],
        recentAttendance: [],
        hrmsSettings: null,
        totalAttendanceHours: 0,
        leaveBalance: 0
    })

    const dependenciesQuery = useHrmsDependencies()

    useEffect(() => {
        setState(prev => ({
            ...prev,
            isLoading: dependenciesQuery.isLoading,
            error: dependenciesQuery.error as Error | null,
            hrmsUser: dependenciesQuery.data?.payload?.hrmsUser || null,
            employee: dependenciesQuery.data?.payload?.employee || null,
            openAttendance: dependenciesQuery.data?.payload?.openAttendance || null,
            leaveRequests: dependenciesQuery.data?.payload?.leaveRequests || [],
            recentAttendance: dependenciesQuery.data?.payload?.recentAttendance || [],
            hrmsSettings: dependenciesQuery.data?.payload?.hrmsSettings || null,
            totalAttendanceHours: dependenciesQuery.data?.payload?.totalAttendanceHours || 0,
            leaveBalance: dependenciesQuery.data?.payload?.leaveBalance || 0
        }))
    }, [dependenciesQuery.data, dependenciesQuery.isLoading, dependenciesQuery.error])

    const updateState = (updates: Partial<PeopleState>) => {
        setState(prev => ({ ...prev, ...updates }))
    }

    const refetch = () => {
        dependenciesQuery.refetch()
    }

    return (
        <PeopleContext.Provider value={{ state, updateState, refetch }}>
            {children}
        </PeopleContext.Provider>
    )
}

export function usePeople() {
    const context = useContext(PeopleContext)
    if (context === undefined) {
        throw new Error('usePeople must be used within a PeopleProvider')
    }
    return context
}
