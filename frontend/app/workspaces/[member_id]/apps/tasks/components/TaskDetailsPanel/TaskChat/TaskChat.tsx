'use client'

import React, { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ChatInput, { ChatFile } from '@/components/ChatInput'
import FileThumbnailRenderer from '@/components/FileThumbnailRenderer'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TbMessageCircle, TbDots, TbEdit, TbTrash, TbCopy, TbFlag, TbLoader2, TbAlertCircle, TbMoodSmile } from 'react-icons/tb'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { useTaskComments, useCreateComment, useAddReaction, useRemoveReaction, Comment } from '@/hooks/use-comments'
import { useWorkspaceMember } from '@/contexts/workspace-member.context'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import type { EmojiClickData } from 'emoji-picker-react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

interface MessageFile {
    id: string
    name: string
    type: string
    size: number
    url: string
}

interface MessageReaction {
    emoji: string
    count: number
    hasReacted: boolean
    memberIds: string[]
}

interface Message {
    id: string
    user: { name: string; avatar: string | null; initials: string; memberId: string }
    message: string
    timestamp: string
    isCurrentUser: boolean
    files?: MessageFile[]
    reactions?: MessageReaction[]
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
}

function convertCommentToMessage(comment: Comment, currentMemberId: string): Message {
    const isCurrentUser = comment.createdBy.id === currentMemberId
    
    const initials = comment.createdBy.firstName && comment.createdBy.lastName
        ? `${comment.createdBy.firstName[0]}${comment.createdBy.lastName[0]}`
        : 'U'

    const name = comment.createdBy.firstName && comment.createdBy.lastName
        ? `${comment.createdBy.firstName} ${comment.createdBy.lastName}`
        : comment.createdBy.email

    return {
        id: comment.id,
        user: {
            name: isCurrentUser ? 'You' : name,
            avatar: comment.createdBy.avatar || null,
            initials,
            memberId: comment.createdBy.id
        },
        message: comment.content,
        timestamp: formatTimeAgo(comment.createdAt),
        isCurrentUser,
        files: comment.files?.map((file: any) => ({
            id: file.id,
            name: file.name,
            type: file.mimeType,
            size: file.size,
            url: file.fileURL
        })) || [],
        reactions: comment.reactions?.map((reaction: any) => ({
            emoji: reaction.emoji,
            count: reaction.memberIds.length,
            hasReacted: reaction.memberIds.includes(currentMemberId),
            memberIds: reaction.memberIds
        })) || []
    }
}

interface MessageBubbleProps {
    message: Message
    onReactionClick: (commentId: string, emoji: string, hasReacted: boolean) => void
    onAddReaction: (commentId: string, emoji: string) => void
}

function MessageBubble({ message, onReactionClick, onAddReaction }: MessageBubbleProps) {
    const [reactionPickerOpen, setReactionPickerOpen] = useState(false)

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onAddReaction(message.id, emojiData.emoji)
        setReactionPickerOpen(false)
    }

    return (
        <div className={`flex-1 max-w-[80%] ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
            <div className={`relative rounded-lg p-3 ${message.isCurrentUser
                ? 'bg-primary/20 text-primary-foreground ml-auto'
                : 'bg-muted'
                }`}>
                {!message.isCurrentUser && (
                    <div className="font-medium text-sm mb-1">{message.user.name}</div>
                )}
                <div className="text-sm whitespace-pre-wrap pr-6">{message.message}</div>

                {message.files && message.files.length > 0 && (
                    <div className="mt-3 -mb-1">
                        {message.files.length === 1 ? (
                            <div className="flex items-center gap-2 p-2 rounded-md border bg-background/50 hover:bg-background/80 transition-colors">
                                <FileThumbnailRenderer
                                    fileType={message.files[0].name}
                                    mimeType={message.files[0].type}
                                    preview={message.files[0].type.startsWith('image/') ? message.files[0].url : undefined}
                                    size="sm"
                                />
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-xs font-medium truncate">
                                        {message.files[0].name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {(message.files[0].size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Carousel
                                opts={{
                                    align: 'start',
                                    loop: false,
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2">
                                    {message.files.map((file) => (
                                        <CarouselItem key={file.id} className="pl-2 basis-auto">
                                            <div className="flex items-center gap-2 p-2 rounded-md border bg-background/50 hover:bg-background/80 transition-colors">
                                                <FileThumbnailRenderer
                                                    fileType={file.name}
                                                    mimeType={file.type}
                                                    preview={file.type.startsWith('image/') ? file.url : undefined}
                                                    size="sm"
                                                />
                                                <div className="flex flex-col min-w-0 max-w-[100px]">
                                                    <span className="text-xs font-medium truncate">
                                                        {file.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {(file.size / 1024).toFixed(1)} KB
                                                    </span>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="-left-2 h-6 w-6" />
                                <CarouselNext className="-right-2 h-6 w-6" />
                            </Carousel>
                        )}
                    </div>
                )}
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`absolute top-2 ${message.isCurrentUser ? 'left-2' : 'right-2'} h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity`}
                        >
                            <TbDots className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={message.isCurrentUser ? 'start' : 'end'}>
                        {message.isCurrentUser && (
                            <>
                                <DropdownMenuItem>
                                    <TbEdit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                    <TbTrash className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem>
                            <TbCopy className="mr-2 h-4 w-4" />
                            <span>Copy</span>
                        </DropdownMenuItem>
                        {!message.isCurrentUser && (
                            <DropdownMenuItem>
                                <TbFlag className="mr-2 h-4 w-4" />
                                <span>Report</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {message.reactions && message.reactions.length > 0 && (
                <div className={cn("flex flex-wrap gap-1 mt-1.5", message.isCurrentUser ? 'justify-end' : 'justify-start')}>
                    {message.reactions.map((reaction, index) => (
                        <button
                            key={index}
                            onClick={() => onReactionClick(message.id, reaction.emoji, reaction.hasReacted)}
                            className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors",
                                reaction.hasReacted
                                    ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
                                    : "bg-muted hover:bg-muted/80"
                            )}
                        >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs font-medium">{reaction.count}</span>
                        </button>
                    ))}
                    <Popover open={reactionPickerOpen} onOpenChange={setReactionPickerOpen}>
                        <PopoverTrigger asChild>
                            <button
                                className={cn(
                                    "inline-flex items-center justify-center h-6 w-6 rounded-full text-xs border transition-colors",
                                    "bg-muted hover:bg-muted/80 border-border"
                                )}
                            >
                                <TbMoodSmile className="h-3.5 w-3.5" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent 
                            className="w-auto p-0 border-0" 
                            align={message.isCurrentUser ? 'end' : 'start'}
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
            
            {(!message.reactions || message.reactions.length === 0) && (
                <div className={cn("flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity", message.isCurrentUser ? 'justify-end' : 'justify-start')}>
                    <Popover open={reactionPickerOpen} onOpenChange={setReactionPickerOpen}>
                        <PopoverTrigger asChild>
                            <button
                                className={cn(
                                    "inline-flex items-center justify-center h-6 w-6 rounded-full text-xs border transition-colors",
                                    "bg-muted hover:bg-muted/80 border-border"
                                )}
                            >
                                <TbMoodSmile className="h-3.5 w-3.5" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent 
                            className="w-auto p-0 border-0" 
                            align={message.isCurrentUser ? 'end' : 'start'}
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

            <div className={`text-xs text-muted-foreground mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                {message.timestamp}
            </div>
        </div>
    )
}

interface TaskChatProps {
    taskId: string
}

const messages = [
    {
        id: '1',
        user: { name: 'John Doe', avatar: null, initials: 'JD' },
        message: 'Hey team, I started working on this task. Should be completed by end of week.',
        timestamp: '2 hours ago',
        isCurrentUser: false
    },
    {
        id: '2',
        user: { name: 'You', avatar: null, initials: 'ME' },
        message: 'Great! Let me know if you need any clarification on the requirements.',
        timestamp: '1 hour ago',
        isCurrentUser: true
    },
    {
        id: '3',
        user: { name: 'Sarah Wilson', avatar: null, initials: 'SW' },
        message: 'I can help with the design review once you have a draft ready.',
        timestamp: '45 minutes ago',
        isCurrentUser: false
    },
    {
        id: '4',
        user: { name: 'Mike Johnson', avatar: null, initials: 'MJ' },
        message: 'Just a heads up - we might need to adjust the timeline based on the client feedback we received yesterday.',
        timestamp: '30 minutes ago',
        isCurrentUser: false
    },
    {
        id: '5',
        user: { name: 'You', avatar: null, initials: 'ME' },
        message: 'Thanks for the update Mike. Let\'s discuss this in tomorrow\'s standup meeting.',
        timestamp: '25 minutes ago',
        isCurrentUser: true
    },
    {
        id: '6',
        user: { name: 'Emily Davis', avatar: null, initials: 'ED' },
        message: 'I\'ve updated the design mockups based on the latest requirements. You can find them in the shared folder.',
        timestamp: '15 minutes ago',
        isCurrentUser: false
    },
    {
        id: '7',
        user: { name: 'Sarah Wilson', avatar: null, initials: 'SW' },
        message: 'Perfect timing Emily! I\'ll review them this afternoon and get back to you with feedback.',
        timestamp: '10 minutes ago',
        isCurrentUser: false
    },
    {
        id: '8',
        user: { name: 'You', avatar: null, initials: 'ME' },
        message: 'Great work everyone! Keep up the momentum. 🚀',
        timestamp: '5 minutes ago',
        isCurrentUser: true
    }
]

export default function TaskChat({ taskId }: TaskChatProps) {
    const [newMessage, setNewMessage] = useState('')
    const [chatFiles, setChatFiles] = useState<ChatFile[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const listId = params.list_id as string
    const { state } = useWorkspaceMember()
    const workspaceMember = state.member
    
    const { data: commentsData, isLoading, error, refetch } = useTaskComments(listId, taskId, 1, 50)
    const createCommentMutation = useCreateComment()
    const addReactionMutation = useAddReaction()
    const removeReactionMutation = useRemoveReaction()

    const messages: Message[] = React.useMemo(() => {
        if (!commentsData?.data?.comments || !workspaceMember) return []
        return commentsData.data.comments.map((comment: any) => 
            convertCommentToMessage(comment, workspaceMember._id)
        )
    }, [commentsData, workspaceMember])

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget
        if (target.scrollTop === 0 && !isLoadingMore) {
            setIsLoadingMore(true)
            setTimeout(() => {
                setIsLoadingMore(false)
            }, 1500)
        }
    }

    const handleSendMessage = async (message: string, files: File[]) => {
        if (message.trim() || files.length > 0) {
            try {
                await createCommentMutation.mutateAsync({
                    listId,
                    taskId,
                    content: message,
                    files
                })
                
                setNewMessage('')
                setChatFiles([])
            } catch (error) {
                console.error('Failed to send message:', error)
            }
        }
    }

    const handleReactionClick = async (commentId: string, emoji: string, hasReacted: boolean) => {
        try {
            if (hasReacted) {
                await removeReactionMutation.mutateAsync({ listId, taskId, commentId, emoji })
            } else {
                await addReactionMutation.mutateAsync({ listId, taskId, commentId, emoji })
            }
        } catch (error) {
            console.error('Failed to toggle reaction:', error)
        }
    }

    const handleAddReaction = async (commentId: string, emoji: string) => {
        try {
            await addReactionMutation.mutateAsync({ listId, taskId, commentId, emoji })
        } catch (error) {
            console.error('Failed to add reaction:', error)
        }
    }

    if (error) {
        return (
            <div className="flex flex-col h-full">
                <div className="p-4 border-b bg-background/80 backdrop-blur-sm top-0 sticky z-30">
                    <h3 className="font-semibold text-lg">Task Discussion</h3>
                    <p className="text-sm text-muted-foreground">Collaborate with your team on this task</p>
                </div>
                <div className="flex-1 flex items-center justify-center p-8">
                    <SectionPlaceholder
                        icon={TbAlertCircle}
                        heading="Failed to load comments"
                        subHeading="There was an error loading the discussion. Please try again."
                        variant="error"
                        ctaButton={{
                            label: 'Try Again',
                            onClick: () => refetch(),
                            variant: 'outline'
                        }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-background/80 backdrop-blur-sm top-0 sticky z-30">
                <h3 className="font-semibold text-lg">Task Discussion</h3>
                <p className="text-sm text-muted-foreground">Collaborate with your team on this task</p>
            </div>

            <ScrollArea className="flex-1 p-4" onScrollCapture={handleScroll}>
                {isLoadingMore && (
                    <div className="flex justify-center py-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TbLoader2 className="h-4 w-4 animate-spin" />
                            <span>Loading more messages...</span>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-16 w-full max-w-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 group ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}
                            >
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={message.user.avatar || undefined} />
                                    <AvatarFallback className="text-xs">{message.user.initials}</AvatarFallback>
                                </Avatar>

                                <MessageBubble 
                                    message={message} 
                                    onReactionClick={handleReactionClick}
                                    onAddReaction={handleAddReaction}
                                />
                            </div>
                        ))}
                        
                        {createCommentMutation.isPending && (
                            <div className="flex gap-3 flex-row-reverse">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={workspaceMember?.avatarURL?.original || undefined} />
                                    <AvatarFallback className="text-xs">
                                        {workspaceMember?.firstName?.[0]}{workspaceMember?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 max-w-[80%] items-end">
                                    <div className="relative rounded-lg p-3 bg-primary/20 text-primary-foreground ml-auto opacity-70">
                                        <div className="text-sm whitespace-pre-wrap mb-2">{newMessage}</div>
                                        
                                        {chatFiles.length > 0 && (
                                            <div className="mt-2 mb-2">
                                                {chatFiles.length === 1 ? (
                                                    <div className="flex items-center gap-2 p-2 rounded-md border bg-background/50 opacity-70">
                                                        <FileThumbnailRenderer
                                                            fileType={chatFiles[0].file.name}
                                                            mimeType={chatFiles[0].file.type}
                                                            preview={chatFiles[0].file.type.startsWith('image/') ? chatFiles[0].preview : undefined}
                                                            size="sm"
                                                        />
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <span className="text-xs font-medium truncate">
                                                                {chatFiles[0].file.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {(chatFiles[0].file.size / 1024).toFixed(1)} KB
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Carousel
                                                        opts={{
                                                            align: 'start',
                                                            loop: false,
                                                        }}
                                                        className="w-full"
                                                    >
                                                        <CarouselContent className="-ml-2">
                                                            {chatFiles.map((file, index) => (
                                                                <CarouselItem key={index} className="pl-2 basis-auto">
                                                                    <div className="flex items-center gap-2 p-2 rounded-md border bg-background/50 opacity-70">
                                                                        <FileThumbnailRenderer
                                                                            fileType={file.file.name}
                                                                            mimeType={file.file.type}
                                                                            preview={file.file.type.startsWith('image/') ? file.preview : undefined}
                                                                            size="sm"
                                                                        />
                                                                        <div className="flex flex-col min-w-0 max-w-[100px]">
                                                                            <span className="text-xs font-medium truncate">
                                                                                {file.file.name}
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {(file.file.size / 1024).toFixed(1)} KB
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </CarouselItem>
                                                            ))}
                                                        </CarouselContent>
                                                        <CarouselPrevious className="-left-2 h-6 w-6" />
                                                        <CarouselNext className="-right-2 h-6 w-6" />
                                                    </Carousel>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-xs">
                                            <TbLoader2 className="h-3 w-3 animate-spin" />
                                            <span>Sending...</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 text-right">
                                        just now
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!isLoading && messages.length === 0 && (
                    <div className="py-8">
                        <SectionPlaceholder
                            icon={TbMessageCircle}
                            heading="No messages yet"
                            subHeading="Start a conversation about this task by typing a message below."
                            variant="empty"
                        />
                    </div>
                )}
                <div className='h-[10rem]' />
            </ScrollArea>

            <div className="p-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0 z-30">
                <ChatInput
                    value={newMessage}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    onSend={handleSendMessage}
                    onChange={setNewMessage}
                    files={chatFiles}
                    onFilesChange={setChatFiles}
                    showFormatting={true}
                    maxFiles={5}
                    acceptedFileTypes="image/*,application/pdf,.doc,.docx,.txt"
                    disabled={isLoading || createCommentMutation.isPending}
                />
            </div>
        </div>
    )
}
