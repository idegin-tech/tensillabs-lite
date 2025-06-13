import { Button } from '@/components/ui/button'
import React from 'react'

export default function TasksListOptions() {
    return (
        <div className='h-12 border-b flex items-center gap-2 px-4'>
            <Button size='sm' variant={'outline'}>
                Show / Hide Columns
            </Button>
        </div>
    )
}
