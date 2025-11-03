'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import MarkdownRenderer, { MentionedMember } from '@/components/MarkdownRenderer'

export interface IncomingChatBubbleProps {
    message: string
    files?: React.ReactNode
    className?: string
    mentionedMembers?: MentionedMember[]
}

export default function IncomingChatBubble({
    message,
    files,
    className,
    mentionedMembers,
}: IncomingChatBubbleProps) {
    return (
        <div
            className={cn(
                'relative rounded-2xl rounded-tl-md p-3.5 shadow-sm max-w-[85%]',
                'bg-muted/80 backdrop-blur-sm border border-border/50',
                'hover:bg-muted transition-colors duration-200',
                className
            )}
        >
            <div className="text-sm text-foreground leading-relaxed pr-6">
                <MarkdownRenderer
                    content={message}
                    collapsible={true}
                    maxLength={900}
                    className="prose-p:mb-1 prose-p:last:mb-0"
                    mentionedMembers={mentionedMembers}
                    allowHtml={true}
                />
            </div>

            {files && (
                <div className="mt-3">
                    {files}
                </div>
            )}
        </div>
    )
}
