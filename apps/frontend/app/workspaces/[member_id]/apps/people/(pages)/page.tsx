'use client'

import AppBody from '@/components/layout/app-layout/AppBody'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    TbCalendarOff,
    TbBeach,
    TbClock2,
    TbUser
} from 'react-icons/tb'
import { format } from 'date-fns'
import ClockInOut from '@/app/workspaces/[member_id]/apps/people/components/self-service/ClockInOut';
import EmployeeActions from '@/app/workspaces/[member_id]/apps/people/components/self-service/EmployeeActions';
import RecentAttendance from '@/app/workspaces/[member_id]/apps/people/components/self-service/RecentAttendance';
import RecentLeave from '@/app/workspaces/[member_id]/apps/people/components/self-service/RecentLeave';
import { useWorkspaceMember } from '@/contexts/workspace-member.context'
import { usePeople } from '../contexts/people-app.context'
import PeoplePageLoading from './PeoplePageLoading'

export default function PeoplesPage() {
    const { state: { member } } = useWorkspaceMember();
    const { state: { openAttendance, isLoading, recentAttendance, leaveRequests, hrmsSettings, totalAttendanceHours, leaveBalance } } = usePeople();
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Open</Badge>
            case 'closed':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Closed</Badge>
            case 'Present':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>
            case 'Sick Leave':
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Sick Leave</Badge>
            case 'Approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
            case 'Pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
            case 'Rejected': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    if(!member){
        return null
    }

    if(isLoading){
        return <PeoplePageLoading />
    }

    return (
        <AppBody>
            <div className="space-y-8 container mx-auto py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome back, {member.firstName}!</h1>
                        <p className="text-muted-foreground mt-1">
                            {format(currentTime, 'EEEE, MMMM d, yyyy')} • {format(currentTime, 'HH:mm')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                        <TbUser className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">You</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2">
                        <ClockInOut
                            openAttendance={openAttendance}
                            hrmsSettings={hrmsSettings}
                        />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="px-6 py-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <TbClock2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">Total</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-bold text-foreground">{totalAttendanceHours.toFixed(1)}h</div>
                                        <div className="text-sm text-muted-foreground">Total Hours</div>
                                        <div className="text-xs text-muted-foreground">All time attendance</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="px-6 py-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <TbCalendarOff className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">Available</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-bold text-foreground">{leaveBalance}</div>
                                        <div className="text-sm text-muted-foreground">Leave Balance</div>
                                        <div className="text-xs text-muted-foreground">Remaining this year</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <EmployeeActions />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
                    <RecentAttendance
                        attendanceHistory={recentAttendance}
                        getStatusBadge={getStatusBadge}
                    />

                    <RecentLeave
                        leaveRequests={leaveRequests}
                        getStatusBadge={getStatusBadge}
                    />
                </div>
            </div>
        </AppBody>
    )
}
