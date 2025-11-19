'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export default function TaskChatLoading() {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <MessageSkeleton isCurrentUser={false} />
                    <MessageSkeleton isCurrentUser={true} />
                    <MessageSkeleton isCurrentUser={false} />
                    <MessageSkeleton isCurrentUser={true} />
                    <MessageSkeleton isCurrentUser={false} />
                    <MessageSkeleton isCurrentUser={false} />
                    <MessageSkeleton isCurrentUser={true} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Skeleton className="h-[60px] w-full rounded-md" />
                    </div>
                    <Skeleton className="h-[60px] w-[60px] rounded-md" />
                </div>
            </div>
        </div>
    )
}

const MessageSkeleton = ({ isCurrentUser }: { isCurrentUser: boolean }) => {
    return (
        <div className={`flex gap-3 animate-pulse ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />

            <div className={`flex-1 max-w-[80%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-lg p-3 space-y-2 ${isCurrentUser ? 'ml-auto bg-primary/5' : 'bg-muted/50'}`}>
                    {!isCurrentUser && (
                        <Skeleton className="h-4 w-24 mb-2" />
                    )}
                    <Skeleton className={`h-3 ${isCurrentUser ? 'w-48' : 'w-64'}`} />
                    <Skeleton className={`h-3 ${isCurrentUser ? 'w-32' : 'w-48'}`} />
                </div>
                <Skeleton className={`h-3 w-20 mt-1 ${isCurrentUser ? 'ml-auto' : ''}`} />
            </div>
        </div>
    )
}
