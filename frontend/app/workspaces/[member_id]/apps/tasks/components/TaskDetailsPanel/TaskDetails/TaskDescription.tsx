import { Button } from '@/components/ui/button'
import React from 'react'
import { TbPlus } from 'react-icons/tb'

interface TaskDescriptionProps {
    description?: string
}

export default function TaskDescription({ description }: TaskDescriptionProps) {
    return (
        <div className='px-4'>
            <div className='flex items-center justify-between'>
                <label>Description</label>
                {!description && (
                    <Button variant={'ghost'}><TbPlus /> Add description</Button>
                )}
            </div>
            {description && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {description}
                    </p>
                </div>
            )}
        </div>
    )
}
