'use client'

import { TbClock } from 'react-icons/tb'

export default function TimesheetHeader() {
    return (
        <div className='space-y-2 mb-8'>
            <div className='flex items-center gap-3'>
                <div className='h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center'>
                    <TbClock className='h-6 w-6 text-primary' />
                </div>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Timesheet</h1>
                    <p className='text-muted-foreground text-sm'>
                        Track your time and manage your work hours efficiently
                    </p>
                </div>
            </div>
        </div>
    )
}
