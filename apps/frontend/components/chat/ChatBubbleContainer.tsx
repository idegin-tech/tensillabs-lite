'use client'

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TbDots, TbEdit, TbTrash, TbCopy, TbFlag, TbMoodSmile, TbCornerUpLeft } from 'react-icons/tb'
import dynamic from 'next/dynamic'
import type { EmojiClickData } from 'emoji-picker-react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

export type OnlineStatus = 'online' | 'offline' | 'recently'

export interface ChatReaction {
    emoji: string
    count: number
    hasReacted: boolean
    memberIds: string[]
}

export interface ChatBubbleContainerProps {
    avatar?: string | null
    initials: string
    name: string
    timestamp: string
    isCurrentUser?: boolean
    onlineStatus?: OnlineStatus
    showAvatar?: boolean
    reactions?: ChatReaction[]
    onReactionClick?: (emoji: string, hasReacted: boolean) => void
    onAddReaction?: (emoji: string) => void
    onReply?: () => void
    onEdit?: () => void
    onDelete?: () => void
    onCopy?: () => void
    onReport?: () => void
    showDropdown?: boolean
    children: React.ReactNode
    className?: string
}

export default function ChatBubbleContainer({
    avatar,
    initials,
    name,
    timestamp,
    isCurrentUser = false,
    onlineStatus,
    showAvatar = true,
    reactions = [],
    onReactionClick,
    onAddReaction,
    onReply,
    onEdit,
    onDelete,
    onCopy,
    onReport,
    showDropdown = true,
    children,
    className,
}: ChatBubbleContainerProps) {
    const [reactionPickerOpen, setReactionPickerOpen] = React.useState(false)

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        if (onAddReaction) {
            onAddReaction(emojiData.emoji)
            setReactionPickerOpen(false)
        }
    }

    const getStatusColor = (status?: OnlineStatus) => {
        switch (status) {
            case 'online':
                return 'bg-green-500'
            case 'offline':
                return 'bg-gray-400'
            case 'recently':
                return 'bg-yellow-500'
            default:
                return ''
        }
    }

    return (
        <div
            className={cn(
                'flex gap-3 group',
                isCurrentUser ? 'flex-row-reverse' : '',
                className
            )}
        >
            {showAvatar && (
                <div className="relative flex-shrink-0 h-8 w-8">
                    <div className="h-full w-full rounded-full overflow-hidden border-2 border-background bg-muted flex items-center justify-center">
                        {avatar ? (
                            <img 
                                src={avatar} 
                                alt={name} 
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-xs font-medium text-muted-foreground">
                                {initials}
                            </span>
                        )}
                    </div>
                    {onlineStatus && (
                        <div
                            className={cn(
                                'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background',
                                getStatusColor(onlineStatus)
                            )}
                            title={onlineStatus}
                        />
                    )}
                </div>
            )}

            <div className={cn('flex-1 max-w-[80%] flex flex-col space-y-1.5', isCurrentUser ? 'items-end' : 'items-start')}>
                <div className={cn('flex items-center gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                    <span className="font-medium text-sm text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground">{timestamp}</span>
                </div>

                <div className="relative">
                        {children}

                        {showDropdown && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        'absolute top-2 h-6 w-6 p-0 transition-opacity bg-sidebar shadow-md z-20 opacity-0 group-hover:opacity-100',
                                        isCurrentUser ? 'right-2' : 'left-2'
                                    )}
                                >
                                    <TbDots className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isCurrentUser ? 'end' : 'start'} className="min-w-[160px]">
                                {onReply && (
                                    <>
                                        <DropdownMenuItem onClick={onReply}>
                                            <TbCornerUpLeft className="mr-2 h-4 w-4" />
                                            <span>Reply</span>
                                        </DropdownMenuItem>
                                        
                                    </>
                                )}
                                {onCopy && (
                                    <DropdownMenuItem onClick={onCopy}>
                                        <TbCopy className="mr-2 h-4 w-4" />
                                        <span>Copy</span>
                                    </DropdownMenuItem>
                                )}
                                {isCurrentUser && (
                                    <>
                                        {onEdit && (
                                            <DropdownMenuItem onClick={onEdit}>
                                                <TbEdit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && (
                                            <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                                                <TbTrash className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                            </>
                                        )}
                                    </>
                                )}
                                
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {reactions.length > 0 && (
                    <div className={cn('flex flex-wrap gap-1', isCurrentUser ? 'justify-end' : 'justify-start')}>
                        {reactions.map((reaction, index) => (
                            <button
                                key={index}
                                onClick={() => onReactionClick?.(reaction.emoji, reaction.hasReacted)}
                                className={cn(
                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all duration-200',
                                    'hover:scale-105 active:scale-95',
                                    reaction.hasReacted
                                        ? 'bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/40'
                                        : 'bg-muted border-border hover:bg-muted/80 hover:border-border/80'
                                )}
                            >
                                <span className="text-sm">{reaction.emoji}</span>
                                <span className="text-xs font-medium">{reaction.count}</span>
                            </button>
                        ))}
                        {onAddReaction && (
                            <Popover open={reactionPickerOpen} onOpenChange={setReactionPickerOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        className={cn(
                                            'inline-flex items-center justify-center h-6 w-6 rounded-full text-xs border transition-all duration-200',
                                            'bg-muted hover:bg-muted/80 border-border hover:scale-105 active:scale-95'
                                        )}
                                    >
                                        <TbMoodSmile className="h-3.5 w-3.5" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0 border-0 rounded-lg"
                                    align={isCurrentUser ? 'end' : 'start'}
                                    side="top"
                                >
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        autoFocusSearch={false}
                                        reactionsDefaultOpen={true}
                                        reactions={['1f44d', '2764-fe0f', '1f389', '1f44f', '1f525', '1f4af']}
                                        width={350}
                                        height={400}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                )}

                {reactions.length === 0 && onAddReaction && (
                    <div className={cn('flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity', isCurrentUser ? 'justify-end' : 'justify-start')}>
                        <Popover open={reactionPickerOpen} onOpenChange={setReactionPickerOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        'inline-flex items-center justify-center h-6 w-6 rounded-full text-xs border transition-all duration-200',
                                        'bg-muted hover:bg-muted/80 border-border hover:scale-105 active:scale-95'
                                    )}
                                >
                                    <TbMoodSmile className="h-3.5 w-3.5" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0 border-0 rounded-lg"
                                align={isCurrentUser ? 'end' : 'start'}
                                side="top"
                            >
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    autoFocusSearch={false}
                                    reactionsDefaultOpen={true}
                                    reactions={['1f44d', '2764-fe0f', '1f389', '1f44f', '1f525', '1f4af']}
                                    width={350}
                                    height={400}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
        </div>
    )
}
