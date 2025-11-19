'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import MarkdownRenderer, { MentionedMember } from '@/components/MarkdownRenderer'
import { TbCornerUpLeft } from 'react-icons/tb'

export interface IncomingChatBubbleProps {
    message: string
    files?: React.ReactNode
    className?: string
    mentionedMembers?: MentionedMember[]
    quotedMessage?: {
        id: string
        content: string
        member: {
            name: string
            avatar?: string
        }
        timestamp: string
    }
    isDeleted?: boolean
    error?: string
    onRetry?: () => void
}

export default function IncomingChatBubble({
    message,
    files,
    className,
    mentionedMembers,
    quotedMessage,
    isDeleted = false,
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
            {quotedMessage && (
                <div className="mb-3 pb-3 border-b border-border/50">
                    <div className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-secondary/5 border-l-2 border-secondary">
                        <TbCornerUpLeft className="h-3.5 w-3.5 text-secondary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-secondary">
                                    {quotedMessage.member.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {quotedMessage.timestamp}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {quotedMessage.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                                {quotedMessage.content.length > 100 && '...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isDeleted ? (
                <div className="text-sm text-muted-foreground italic leading-relaxed pr-6 min-w-60">
                    Message deleted
                </div>
            ) : (
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
            )}

            {files && (
                <div className="mt-3 p-2">
                    {files}
                </div>
            )}
        </div>
    )
}
