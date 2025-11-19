'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface ChatBubbleLoadingProps {
    count?: number
    showIncoming?: boolean
    showOutgoing?: boolean
    className?: string
}

function IncomingBubbleSkeleton() {
    return (
        <div className="flex gap-3 animate-pulse">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 max-w-[70%] space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-20 w-full rounded-2xl rounded-tl-md" />
                    <div className="flex gap-1">
                        <Skeleton className="h-6 w-12 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function OutgoingBubbleSkeleton() {
    return (
        <div className="flex gap-3 flex-row-reverse animate-pulse">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 max-w-[70%] space-y-2 items-end">
                <div className="flex items-center gap-2 justify-end">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-2 flex flex-col items-end">
                    <Skeleton className="h-16 w-full rounded-2xl rounded-tr-md bg-primary/20" />
                    <div className="flex gap-1">
                        <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function IncomingBubbleWithFilesSkeleton() {
    return (
        <div className="flex gap-3 animate-pulse">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 max-w-[75%] space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-2xl rounded-tl-md" />
                    <div className="flex gap-2">
                        <Skeleton className="h-16 w-32 rounded-lg" />
                        <Skeleton className="h-16 w-32 rounded-lg" />
                    </div>
                    <div className="flex gap-1">
                        <Skeleton className="h-6 w-12 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function OutgoingBubbleWithFileSkeleton() {
    return (
        <div className="flex gap-3 flex-row-reverse animate-pulse">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 max-w-[70%] space-y-2 items-end">
                <div className="flex items-center gap-2 justify-end">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-3 flex flex-col items-end w-full">
                    <Skeleton className="h-14 w-full rounded-2xl rounded-tr-md bg-primary/20" />
                    <Skeleton className="h-20 w-4/5 rounded-lg bg-primary/20" />
                </div>
            </div>
        </div>
    )
}

export default function ChatBubbleLoading({
    count = 3,
    showIncoming = true,
    showOutgoing = true,
    className,
}: ChatBubbleLoadingProps) {
    const patterns = React.useMemo(() => {
        const result = []
        for (let i = 0; i < count; i++) {
            const rand = Math.random()
            if (showIncoming && showOutgoing) {
                if (rand < 0.3) {
                    result.push('incoming')
                } else if (rand < 0.5) {
                    result.push('incoming-files')
                } else if (rand < 0.75) {
                    result.push('outgoing')
                } else {
                    result.push('outgoing-file')
                }
            } else if (showIncoming) {
                result.push(rand < 0.6 ? 'incoming' : 'incoming-files')
            } else if (showOutgoing) {
                result.push(rand < 0.7 ? 'outgoing' : 'outgoing-file')
            }
        }
        return result
    }, [count, showIncoming, showOutgoing])

    return (
        <div className={cn('space-y-6', className)}>
            {patterns.map((pattern, index) => {
                switch (pattern) {
                    case 'incoming':
                        return <IncomingBubbleSkeleton key={index} />
                    case 'incoming-files':
                        return <IncomingBubbleWithFilesSkeleton key={index} />
                    case 'outgoing':
                        return <OutgoingBubbleSkeleton key={index} />
                    case 'outgoing-file':
                        return <OutgoingBubbleWithFileSkeleton key={index} />
                    default:
                        return null
                }
            })}
        </div>
    )
}
