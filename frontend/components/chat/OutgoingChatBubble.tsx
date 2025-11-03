'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export interface OutgoingChatBubbleProps {
    message: string
    files?: React.ReactNode
    isSending?: boolean
    className?: string
}

export default function OutgoingChatBubble({
    message,
    files,
    isSending = false,
    className,
}: OutgoingChatBubbleProps) {
    return (
        <div
            className={cn(
                'relative rounded-2xl rounded-tr-md p-3.5 shadow-md ml-auto max-w-[85%]',
                'bg-accent/60 text-accent-foreground border border-primary/20',
                'transition-colors duration-200',
                isSending && 'opacity-70 cursor-wait',
                className
            )}
        >
            <div className="text-sm leading-relaxed pr-6 break-words overflow-hidden">
                <MarkdownRenderer
                    content={message}
                    collapsible={true}
                    maxLength={300}
                    className="prose-p:mb-1 prose-p:last:mb-0 prose-a:text-primary-foreground prose-a:underline prose-code:bg-primary-foreground/10 prose-code:text-primary-foreground"
                />
            </div>

            {files && (
                <div className="mt-3">
                    {files}
                </div>
            )}

            {isSending && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                        <span className="w-1 h-1 bg-primary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-primary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-primary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}
        </div>
    )
}
