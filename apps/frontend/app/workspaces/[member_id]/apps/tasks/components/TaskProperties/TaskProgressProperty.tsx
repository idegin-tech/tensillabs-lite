'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { TaskPropertyProps } from '.'

export default function TaskProgressProperty({ value }: TaskPropertyProps) {
    const progress = value || 0

    let progressColor = 'bg-error'
    if (progress >= 100) {
        progressColor = 'bg-success'
    } else if (progress >= 50) {
        progressColor = 'bg-warning'
    }

    return (
        <div className="flex items-center gap-2">
            <div className={cn('flex-1 h-2 rounded-full overflow-hidden border', `${progressColor}/40`)}>
                <div
                    className={cn('h-full transition-all duration-500', progressColor)}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <span className="text-xs text-muted-foreground min-w-[35px]">{progress}%</span>
        </div>
    )
}
