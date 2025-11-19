'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import MarkdownRenderer, { MentionedMember } from '@/components/MarkdownRenderer'
import { TbCornerUpLeft, TbAlertCircle, TbRefresh } from 'react-icons/tb'
import { Button } from '@/components/ui/button'

export interface OutgoingChatBubbleProps {
    message: string
    files?: React.ReactNode
    isSending?: boolean
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

export default function OutgoingChatBubble({
    message,
    files,
    isSending = false,
    className,
    mentionedMembers,
    quotedMessage,
    isDeleted = false,
    error,
    onRetry,
}: OutgoingChatBubbleProps) {
    return (
        <div
            className={cn(
                'relative rounded-2xl rounded-tr-md shadow-md ml-auto max-w-[85%]',
                'bg-accent/60 text-accent-foreground border border-primary/20',
                'transition-colors duration-200 min-w-[70%]',
                isSending && 'opacity-70 cursor-wait',
                error && 'border-destructive/50 bg-destructive/5',
                className
            )}
        >
            {quotedMessage && (
                <div className="border-primary/20">
                    <div className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-primary/5 border-l-2 border-primary">
                        <TbCornerUpLeft className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-primary">
                                    {quotedMessage.member.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {quotedMessage.timestamp}
                                </span>
                            </div>
                            <p className="text-xs text-accent-foreground/70 line-clamp-2">
                                {quotedMessage.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                                {quotedMessage.content.length > 100 && '...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isDeleted ? (
                <div className="text-sm text-accent-foreground/60 italic leading-relaxed pr-6 break-words overflow-hidden p-3.5 min-w-60">
                    Message deleted
                </div>
            ) : (
                <div className="text-sm leading-relaxed pr-6 break-words overflow-hidden p-3.5">
                    <MarkdownRenderer
                        content={message}
                        collapsible={true}
                        maxLength={900}
                        className="prose-p:mb-1 prose-p:last:mb-0 prose-a:text-primary-foreground prose-a:underline prose-code:bg-primary-foreground/10 prose-code:text-primary-foreground"
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

            {isSending && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                        <span className="w-1 h-1 bg-primary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-primary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-primary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}

            {error && (
                <div className="px-3.5 pb-3 pt-1">
                    <div className="flex items-center gap-2 text-xs text-destructive">
                        <TbAlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="flex-1">{error}</span>
                        {onRetry && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs hover:bg-destructive/10"
                                onClick={onRetry}
                            >
                                <TbRefresh className="h-3 w-3 mr-1" />
                                Retry
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
