'use client'

import AppBody from '@/components/layout/app-layout/AppBody'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
    TbClock,
    TbPlayerPlayFilled,
    TbPlayerPauseFilled,
    TbCalendarOff,
    TbBeach,
    TbClock2,
    TbCalendarEvent,
    TbTrendingUp,
    TbUser
} from 'react-icons/tb'
import { format } from 'date-fns'

export default function PeoplesPage() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isClocked, setIsClockedIn] = useState(false)
    const [clockedInTime, setClockedInTime] = useState<Date | null>(null)
    const [workDuration, setWorkDuration] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
            if (isClocked && clockedInTime) {
                setWorkDuration(Math.floor((new Date().getTime() - clockedInTime.getTime()) / 1000))
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [isClocked, clockedInTime])

    const handleClockToggle = () => {
        if (!isClocked) {
            setIsClockedIn(true)
            setClockedInTime(new Date())
            setWorkDuration(0)
        } else {
            setIsClockedIn(false)
            setClockedInTime(null)
            setWorkDuration(0)
        }
    }

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const mockAttendanceHistory = [
        { date: '2024-01-15', clockIn: '09:00 AM', clockOut: '05:30 PM', totalHours: '8h 30m', status: 'Present' },
        { date: '2024-01-14', clockIn: '09:15 AM', clockOut: '05:45 PM', totalHours: '8h 30m', status: 'Present' },
        { date: '2024-01-13', clockIn: '-', clockOut: '-', totalHours: '-', status: 'Sick Leave' },
        { date: '2024-01-12', clockIn: '08:45 AM', clockOut: '05:15 PM', totalHours: '8h 30m', status: 'Present' },
        { date: '2024-01-11', clockIn: '09:00 AM', clockOut: '05:30 PM', totalHours: '8h 30m', status: 'Present' },
    ]

    const mockLeaveRequests = [
        { id: 1, type: 'Annual Leave', dates: 'Jan 20-22, 2024', days: 3, status: 'Pending', reason: 'Family vacation' },
        { id: 2, type: 'Sick Leave', dates: 'Jan 13, 2024', days: 1, status: 'Approved', reason: 'Medical appointment' },
        { id: 3, type: 'Personal Leave', dates: 'Dec 28-29, 2023', days: 2, status: 'Approved', reason: 'Personal matters' },
    ]

    const getStatusBadge = (status: string) => {
        switch (status) {
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

    return (
        <AppBody>
            <div className="space-y-8 container mx-auto py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
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
                        <Card className="border-0 shadow-md h-full">
                            <CardHeader className="pb-6">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <TbClock className="h-5 w-5 text-primary" />
                                    </div>
                                    Time Tracker
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {isClocked && (
                                    <div className="text-center px-8 py-4 bg-muted/30 rounded-lg border">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full mb-4">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium text-muted-foreground">Currently Working</span>
                                        </div>
                                        <div className="text-5xl font-mono font-bold text-foreground mb-3 tracking-tight">
                                            {formatDuration(workDuration)}
                                        </div>
                                        <div className="text-sm text-muted-foreground mb-6">
                                            Started at {clockedInTime && format(clockedInTime, 'HH:mm')}
                                        </div>
                                        <div className="max-w-sm mx-auto">
                                            <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                                <span>Progress</span>
                                                <span>{Math.floor(workDuration / 3600)}h / 8h</span>
                                            </div>
                                            <Progress
                                                value={Math.min((workDuration / (8 * 3600)) * 100, 100)}
                                                className="h-2 bg-muted"
                                            />
                                        </div>
                                    </div>
                                )}

                                {!isClocked && (
                                    <div className="text-center p-8 bg-muted/30 rounded-lg border">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                            <TbClock className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div className="text-lg font-semibold text-foreground mb-2">Ready to start your day?</div>
                                        <div className="text-sm text-muted-foreground">Click the button below to begin tracking your work time</div>
                                    </div>
                                )}

                                <div className="flex justify-center">
                                    <Button
                                        onClick={handleClockToggle}
                                        size="lg"
                                        variant={isClocked ? "destructive" : "default"}
                                        className="px-8 py-3 text-base font-medium rounded-lg transition-all duration-200"
                                    >
                                        {isClocked ? (
                                            <>
                                                <TbPlayerPauseFilled className="h-5 w-5 mr-2" />
                                                Clock Out
                                            </>
                                        ) : (
                                            <>
                                                <TbPlayerPlayFilled className="h-5 w-5 mr-2" />
                                                Clock In
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <TbCalendarEvent className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">This Week</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-bold text-foreground">40h</div>
                                        <div className="text-sm text-muted-foreground">Hours Worked</div>
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <TbTrendingUp className="h-3 w-3" />
                                            <span>+2h from last week</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <TbCalendarOff className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">Available</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-bold text-foreground">12</div>
                                        <div className="text-sm text-muted-foreground">Leave Days</div>
                                        <div className="text-xs text-muted-foreground">Remaining this year</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 grid grid-cols-2 gap-3">
                                <Button
                                    className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                                    size="lg"
                                >
                                    <TbCalendarOff className="h-5 w-5 mr-3" />
                                    Request Leave
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 text-base font-semibold border-2 hover:bg-muted rounded-lg"
                                    size="lg"
                                >
                                    <TbBeach className="h-5 w-5 mr-3" />
                                    Request Time Off
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <TbClock2 className="h-5 w-5 text-blue-600" />
                                </div>
                                Recent Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b">
                                            <TableHead className="font-semibold">Date</TableHead>
                                            <TableHead className="font-semibold">Clock In</TableHead>
                                            <TableHead className="font-semibold">Clock Out</TableHead>
                                            <TableHead className="font-semibold">Total Hours</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockAttendanceHistory.map((record, index) => (
                                            <TableRow key={index} className="border-b hover:bg-muted/50">
                                                <TableCell className="font-medium py-4">
                                                    {format(new Date(record.date), 'MMM d, yyyy')}
                                                </TableCell>
                                                <TableCell className="py-4">{record.clockIn}</TableCell>
                                                <TableCell className="py-4">{record.clockOut}</TableCell>
                                                <TableCell className="py-4 font-medium">{record.totalHours}</TableCell>
                                                <TableCell className="py-4">{getStatusBadge(record.status)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <TbCalendarOff className="h-5 w-5 text-purple-600" />
                                </div>
                                Leave Request History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b">
                                            <TableHead className="font-semibold">Type</TableHead>
                                            <TableHead className="font-semibold">Dates</TableHead>
                                            <TableHead className="font-semibold">Days</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Reason</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockLeaveRequests.map((request) => (
                                            <TableRow key={request.id} className="border-b hover:bg-muted/50">
                                                <TableCell className="font-medium py-4">{request.type}</TableCell>
                                                <TableCell className="py-4">{request.dates}</TableCell>
                                                <TableCell className="py-4">{request.days} day{request.days > 1 ? 's' : ''}</TableCell>
                                                <TableCell className="py-4">{getStatusBadge(request.status)}</TableCell>
                                                <TableCell className="py-4 max-w-xs">
                                                    <div className="truncate" title={request.reason}>
                                                        {request.reason}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppBody>
    )
}
