import { Button } from '@/components/ui/button'
import React from 'react'
import { TbPlus } from 'react-icons/tb'

export default function TaskDescription() {
    return (
        <div className='px-4'>
            <div className='flex items-center justify-between'>
                <label>Description</label>
                <Button variant={'ghost'}><TbPlus /> Add description</Button>
            </div>
        </div>
    )
}
