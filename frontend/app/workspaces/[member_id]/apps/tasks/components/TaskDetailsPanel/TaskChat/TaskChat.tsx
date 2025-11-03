'use client'

import React, { useState, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
    ChatMessage, 
    ChatBubbleLoading,
    type ChatMessageData,
    type ChatReaction
} from '@/components/chat'
import ChatInput, { ChatFile } from '@/components/chat/ChatInput'
import { TbMessageCircle, TbLoader2, TbAlertCircle } from 'react-icons/tb'
import { useParams } from 'next/navigation'
import { useTaskComments, useCreateComment, useAddReaction, useRemoveReaction, Comment } from '@/hooks/use-comments'
import { useWorkspaceMember } from '@/contexts/workspace-member.context'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { formatDistanceToNow } from 'date-fns'

function convertCommentToMessage(comment: Comment, currentMemberId: string): ChatMessageData {
    const isCurrentUser = comment.createdById === currentMemberId
    
    const initials = comment.createdBy.firstName && comment.createdBy.lastName
        ? `${comment.createdBy.firstName[0]}${comment.createdBy.lastName[0]}`
        : 'U'

    const name = comment.createdBy.firstName && comment.createdBy.lastName
        ? `${comment.createdBy.firstName} ${comment.createdBy.lastName}`
        : comment.createdBy.email

    const mentionedMembers = comment.mentionedMembers?.map((member: any) => ({
        id: member._id,
        label: member.firstName && member.lastName 
            ? `${member.firstName} ${member.lastName}`.trim()
            : member.primaryEmail || member.email,
        email: member.primaryEmail || member.email
    })) || []

    return {
        id: comment._id,
        user: {
            name: isCurrentUser ? 'You' : name,
            avatar: comment.createdBy.avatar || null,
            initials,
            memberId: comment.createdById
        },
        message: comment.content,
        timestamp: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }),
        isCurrentUser,
        onlineStatus: 'online',
        files: comment.files?.map((file: any) => ({
            id: file._id || file.id,
            name: file.name,
            type: file.mimeType,
            size: file.size,
            url: file.fileURL,
            thumbnailUrl: file.thumbnailURL
        })) || [],
        reactions: comment.reactions?.map((reaction: any) => ({
            emoji: reaction.emoji,
            count: reaction.memberIds.length,
            hasReacted: reaction.memberIds.includes(currentMemberId),
            memberIds: reaction.memberIds
        })) || [],
        mentionedMembers
    }
}

interface TaskChatProps {
    taskId: string
}

export default function TaskChat({ taskId }: TaskChatProps) {
    const [newMessage, setNewMessage] = useState('')
    const [chatFiles, setChatFiles] = useState<ChatFile[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [optimisticReactions, setOptimisticReactions] = useState<Record<string, { emoji: string; action: 'add' | 'remove' }[]>>({})
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const listId = params.list_id as string
    const { state } = useWorkspaceMember()
    const workspaceMember = state.member
    
    const { data: commentsData, isLoading, error, refetch } = useTaskComments(listId, taskId, 1, 50)
    const createCommentMutation = useCreateComment()
    const addReactionMutation = useAddReaction()
    const removeReactionMutation = useRemoveReaction()

    const messages: ChatMessageData[] = React.useMemo(() => {
        if (!commentsData?.payload?.comments || !workspaceMember) return []
        
        return commentsData.payload.comments.map((comment: any) => {
            const messageData = convertCommentToMessage(comment, workspaceMember._id)
            
            const commentOptimisticReactions = optimisticReactions[comment._id] || []
            if (commentOptimisticReactions.length > 0) {
                const reactionsMap = new Map<string, ChatReaction>()
                
                messageData.reactions?.forEach(reaction => {
                    reactionsMap.set(reaction.emoji, { ...reaction })
                })
                
                commentOptimisticReactions.forEach(({ emoji, action }) => {
                    const existing = reactionsMap.get(emoji)
                    
                    if (action === 'add') {
                        if (existing) {
                            if (!existing.memberIds.includes(workspaceMember._id)) {
                                existing.memberIds.push(workspaceMember._id)
                                existing.count++
                                existing.hasReacted = true
                            }
                        } else {
                            reactionsMap.set(emoji, {
                                emoji,
                                count: 1,
                                hasReacted: true,
                                memberIds: [workspaceMember._id]
                            })
                        }
                    } else if (action === 'remove') {
                        if (existing) {
                            const memberIndex = existing.memberIds.indexOf(workspaceMember._id)
                            if (memberIndex > -1) {
                                existing.memberIds.splice(memberIndex, 1)
                                existing.count--
                                existing.hasReacted = false
                                
                                if (existing.count === 0) {
                                    reactionsMap.delete(emoji)
                                }
                            }
                        }
                    }
                })
                
                messageData.reactions = Array.from(reactionsMap.values())
            }
            
            return messageData
        })
    }, [commentsData, workspaceMember, optimisticReactions])

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget
        if (target.scrollTop === 0 && !isLoadingMore) {
            setIsLoadingMore(true)
            setTimeout(() => {
                setIsLoadingMore(false)
            }, 1500)
        }
    }

    const handleSendMessage = async (message: string, files: File[], mentionedMemberIds: string[]) => {
        if (message.trim() || files.length > 0) {
            try {
                await createCommentMutation.mutateAsync({
                    listId,
                    taskId,
                    content: message,
                    files,
                    mentionedMemberIds
                })
                
                setNewMessage('')
                setChatFiles([])
            } catch (error) {
                console.error('Failed to send message:', error)
            }
        }
    }

    const handleReactionClick = async (messageId: string, emoji: string, hasReacted: boolean) => {
        const action = hasReacted ? 'remove' : 'add'
        
        setOptimisticReactions(prev => ({
            ...prev,
            [messageId]: [...(prev[messageId] || []), { emoji, action }]
        }))

        try {
            if (hasReacted) {
                await removeReactionMutation.mutateAsync({ listId, taskId, commentId: messageId, emoji })
            } else {
                await addReactionMutation.mutateAsync({ listId, taskId, commentId: messageId, emoji })
            }
        } catch (error) {
            console.error('Failed to toggle reaction:', error)
            
            setOptimisticReactions(prev => {
                const messageReactions = prev[messageId] || []
                return {
                    ...prev,
                    [messageId]: messageReactions.filter(r => !(r.emoji === emoji && r.action === action))
                }
            })
        }
    }

    const handleAddReaction = async (messageId: string, emoji: string) => {
        setOptimisticReactions(prev => ({
            ...prev,
            [messageId]: [...(prev[messageId] || []), { emoji, action: 'add' }]
        }))

        try {
            await addReactionMutation.mutateAsync({ listId, taskId, commentId: messageId, emoji })
        } catch (error) {
            console.error('Failed to add reaction:', error)
            
            setOptimisticReactions(prev => {
                const messageReactions = prev[messageId] || []
                return {
                    ...prev,
                    [messageId]: messageReactions.filter(r => !(r.emoji === emoji && r.action === 'add'))
                }
            })
        }
    }

    const handleCopy = (message: string) => {
        navigator.clipboard.writeText(message)
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
                    <ChatBubbleLoading count={5} showIncoming={true} showOutgoing={true} />
                ) : (
                    <div className="space-y-6 max-w-full">
                        {messages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                data={message}
                                onReactionClick={(emoji, hasReacted) => 
                                    handleReactionClick(message.id, emoji, hasReacted)
                                }
                                onAddReaction={(emoji) => 
                                    handleAddReaction(message.id, emoji)
                                }
                                onCopy={() => handleCopy(message.message)}
                                onFileClick={(file) => {
                                    window.open(file.url, '_blank')
                                }}
                            />
                        ))}
                        
                        {createCommentMutation.isPending && workspaceMember && (
                            <ChatMessage
                                data={{
                                    id: 'sending',
                                    message: newMessage,
                                    isCurrentUser: true,
                                    user: {
                                        name: 'You',
                                        avatar: workspaceMember.avatarURL?.original || null,
                                        initials: `${workspaceMember.firstName?.[0] || ''}${workspaceMember.lastName?.[0] || ''}`,
                                        memberId: workspaceMember._id
                                    },
                                    timestamp: 'just now',
                                    onlineStatus: 'online',
                                    files: chatFiles.map((file, index) => ({
                                        id: `temp-${index}`,
                                        name: file.file.name,
                                        size: file.file.size,
                                        type: file.file.type,
                                        url: file.preview || '',
                                        thumbnailUrl: file.preview
                                    }))
                                }}
                                isSending={true}
                                showDropdown={false}
                            />
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
                    placeholder="Type your message here... (Shift+Enter for new line)"
                    onSend={handleSendMessage}
                    onChange={setNewMessage}
                    files={chatFiles}
                    onFilesChange={setChatFiles}
                    showFormatting={true}
                    maxFiles={5}
                    acceptedFileTypes="image/*,application/pdf,.doc,.docx,.txt"
                    disabled={createCommentMutation.isPending}
                />
            </div>
        </div>
    )
}