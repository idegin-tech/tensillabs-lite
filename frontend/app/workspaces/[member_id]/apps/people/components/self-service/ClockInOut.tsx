'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TbClock,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbFileText,
  TbEdit,
} from 'react-icons/tb';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { Attendance, HrmsSettings } from '../../types/hrms.types';
import { useClockIn, useClockOut } from '../../hooks/use-attendance';
import RemarkDialog from './RemarkDialog';

type Props = {
  openAttendance: Attendance | null;
  hrmsSettings: HrmsSettings | null;
};

export default function ClockInOut({ openAttendance, hrmsSettings }: Props) {
  const clockIn = useClockIn()
  const clockOut = useClockOut()
  const [workDuration, setWorkDuration] = useState(0)
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false)
  const [remarkDialogMode, setRemarkDialogMode] = useState<'clockIn' | 'clockOut' | 'edit'>('clockIn')
  const [pendingRemark, setPendingRemark] = useState('')

  const workHoursPerDay = hrmsSettings?.workHoursPerDay || 8;

  useEffect(() => {
    if (openAttendance) {
      const timer = setInterval(() => {
        const clockInTime = new Date(openAttendance.clockIn).getTime()
        const now = new Date().getTime()
        setWorkDuration(Math.floor((now - clockInTime) / 1000))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [openAttendance])

  const isLateClockIn = (): boolean => {
    if (!hrmsSettings || !hrmsSettings.organizationOpenTime) return false;
    
    const now = new Date();
    const [hours, minutes] = hrmsSettings.organizationOpenTime.split(':').map(Number);
    const openTime = new Date(now);
    openTime.setHours(hours, minutes, 0, 0);
    
    return now > openTime;
  }

  const handleClockToggle = () => {
    if (openAttendance) {
      setRemarkDialogMode('clockOut')
      setRemarkDialogOpen(true)
    } else {
      if (isLateClockIn()) {
        setRemarkDialogMode('clockIn')
        setRemarkDialogOpen(true)
      } else {
        clockIn.mutate({})
      }
    }
  }

  const handleRemarkSave = (remark: string) => {
    if (remarkDialogMode === 'clockIn') {
      clockIn.mutate({ remarks: remark })
    } else if (remarkDialogMode === 'clockOut') {
      clockOut.mutate({ remarks: remark || undefined })
    }
  }

  const handleEditRemark = () => {
    if (openAttendance) {
      setPendingRemark(openAttendance.remarks || '')
      setRemarkDialogMode('edit')
      setRemarkDialogOpen(true)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemarkDialogProps = () => {
    if (remarkDialogMode === 'clockIn') {
      return {
        title: 'Late Clock In - Remark Required',
        description: 'You are clocking in late. Please provide a reason for your late arrival.',
        isRequired: true,
        currentRemark: ''
      }
    } else if (remarkDialogMode === 'clockOut') {
      return {
        title: 'Add Clock Out Remark',
        description: 'You can optionally add a remark for this clock out.',
        isRequired: false,
        currentRemark: openAttendance?.remarks || ''
      }
    } else {
      return {
        title: 'Edit Remark',
        description: 'Update the remark for this attendance record.',
        isRequired: false,
        currentRemark: pendingRemark
      }
    }
  }

  return (
    <>
      <RemarkDialog
        isOpen={remarkDialogOpen}
        onClose={() => setRemarkDialogOpen(false)}
        onSave={handleRemarkSave}
        {...getRemarkDialogProps()}
      />
      
      <Card className="border-0 shadow-md h-full">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TbClock className="h-5 w-5 text-primary" />
            </div>
            Clock In/Out
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 py-0">
          {openAttendance && (
            <div className="text-center px-8 py-4 bg-muted/30 rounded-lg border">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Currently Working
                </span>
              </div>
              <div className="text-5xl font-mono font-bold text-foreground mb-3 tracking-tight">
                {formatDuration(workDuration)}
              </div>
              <div className="text-sm text-muted-foreground mb-6">
                Started at {format(new Date(openAttendance.clockIn), 'HH:mm')}
              </div>
              <div className="max-w-sm mx-auto">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{Math.floor(workDuration / 3600)}h / {workHoursPerDay}h</span>
                </div>
                <Progress
                  value={Math.min((workDuration / (workHoursPerDay * 3600)) * 100, 100)}
                  className="h-2 bg-muted"
                />
              </div>
              {openAttendance.remarks && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg text-left">
                  <div className="flex items-start gap-2">
                    <TbFileText className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">Remark</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 break-words">{openAttendance.remarks}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!openAttendance && (
            <div className="text-center p-8 bg-muted/30 rounded-lg border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <TbClock className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                Ready to start your day?
              </div>
              <div className="text-sm text-muted-foreground">
                Click the button below to begin tracking your work time
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            {openAttendance && (
              <Button
                onClick={handleEditRemark}
                size="lg"
                variant="outline"
                className="px-6 py-3 text-base font-medium rounded-lg"
              >
                <TbEdit className="h-5 w-5 mr-2" />
                {openAttendance.remarks ? 'Edit Remark' : 'Add Remark'}
              </Button>
            )}
            
            <Button
              onClick={handleClockToggle}
              size="lg"
              variant={openAttendance ? 'destructive' : 'default'}
              className="px-8 py-3 text-base font-medium rounded-lg transition-all duration-200"
              disabled={clockIn.isPending || clockOut.isPending}
            >
              {openAttendance ? (
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
    </>
  );
}
