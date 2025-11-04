'use client'

import { useState } from 'react'
import AppBody from '@/components/layout/app-layout/AppBody'
import TimesheetHeader from './components/TimesheetHeader'
import TimeEntryForm from './components/TimeEntryForm'
import TimesheetTable from './components/TimesheetTable'
import TimesheetLoading from './components/TimesheetLoading'

export default function TimesheetPage() {
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleStartTimer = () => {
        setIsTimerRunning(!isTimerRunning)
    }

    return (
        <AppBody>
            <div className='flex justify-center'>
                <div className='md:w-[80rem] py-8'>
                    <TimesheetHeader />

                    <TimeEntryForm
                        onStartTimer={handleStartTimer}
                        isTimerRunning={isTimerRunning}
                    />

                    {isLoading ? (
                        <TimesheetLoading />
                    ) : (
                        <TimesheetTable />
                    )}
                </div>
            </div>
        </AppBody>
    )
}
