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
import { useTaskComments, useCreateComment, useAddReaction, useRemoveReaction, useDeleteComment, Comment, QuotedMessage } from '@/hooks/use-comments'
import { useWorkspaceMember } from '@/contexts/workspace-member.context'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { formatDistanceToNow } from 'date-fns'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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

    let quotedMessage: ChatMessageData['quotedMessage'] = undefined
    if (comment.quotedComment && comment.quotedComment.createdBy) {
        const quotedMemberName = comment.quotedComment.createdBy.firstName && comment.quotedComment.createdBy.lastName
            ? `${comment.quotedComment.createdBy.firstName} ${comment.quotedComment.createdBy.lastName}`
            : comment.quotedComment.createdBy.email || 'Unknown'

        quotedMessage = {
            id: comment.quotedComment._id,
            content: comment.quotedComment.content,
            member: {
                name: quotedMemberName,
                avatar: comment.quotedComment.createdBy.avatarURL?.sm || comment.quotedComment.createdBy.avatarURL?.original
            },
            timestamp: formatDistanceToNow(new Date(comment.quotedComment.createdAt), { addSuffix: true })
        }
    }

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
        mentionedMembers,
        quotedMessage,
        isDeleted: comment.isDeleted || false
    }
}

interface TaskChatProps {
    taskId: string
}

export default function TaskChat({ taskId }: TaskChatProps) {
    const [newMessage, setNewMessage] = useState('')
    const [chatFiles, setChatFiles] = useState<ChatFile[]>([])
    const [quotedMessage, setQuotedMessage] = useState<QuotedMessage | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [optimisticReactions, setOptimisticReactions] = useState<Record<string, { emoji: string; action: 'add' | 'remove' }[]>>({})
    const [optimisticDeletes, setOptimisticDeletes] = useState<Set<string>>(new Set())
    const [failedMessages, setFailedMessages] = useState<Record<string, { error: string; originalData: any }>>({})
    const [sendingMessages, setSendingMessages] = useState<Record<string, ChatMessageData>>({})
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const listId = params.list_id as string
    const { state } = useWorkspaceMember()
    const workspaceMember = state.member
    
    const { data: commentsData, isLoading, error, refetch } = useTaskComments(listId, taskId, 1, 50)
    const createCommentMutation = useCreateComment()
    const addReactionMutation = useAddReaction()
    const removeReactionMutation = useRemoveReaction()
    const deleteCommentMutation = useDeleteComment()

    const messages: ChatMessageData[] = React.useMemo(() => {
        if (!commentsData?.payload?.comments || !workspaceMember) return []
        
        const serverMessages = commentsData.payload.comments.map((comment: any) => {
            const messageData = convertCommentToMessage(comment, workspaceMember._id)
            
            if (optimisticDeletes.has(comment._id)) {
                messageData.isDeleted = true
            }
            
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
        
        const pendingMessages = Object.values(sendingMessages)
        
        return [...serverMessages, ...pendingMessages]
    }, [commentsData, workspaceMember, optimisticReactions, optimisticDeletes, sendingMessages])
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
    
    React.useEffect(() => {
        if (!isLoading && messages.length > 0) {
            scrollToBottom()
        }
    }, [isLoading, messages.length])

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
            const tempId = `temp-${Date.now()}`
            const messageData = {
                message,
                files,
                mentionedMemberIds,
                quotedCommentId: quotedMessage?.id
            }
            
            if (!workspaceMember) return
            
            const optimisticMessage: ChatMessageData = {
                id: tempId,
                user: {
                    name: 'You',
                    avatar: workspaceMember.avatarURL?.sm || workspaceMember.avatarURL?.original || null,
                    initials: workspaceMember.firstName && workspaceMember.lastName
                        ? `${workspaceMember.firstName[0]}${workspaceMember.lastName[0]}`
                        : 'Y',
                    memberId: workspaceMember._id
                },
                message: message,
                timestamp: 'Just now',
                isCurrentUser: true,
                onlineStatus: 'online',
                files: files.map((file, index) => ({
                    id: `temp-file-${index}`,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    url: URL.createObjectURL(file),
                    thumbnailUrl: undefined
                })),
                reactions: [],
                mentionedMembers: mentionedMemberIds.map(id => ({ id, label: '', email: '' })),
                quotedMessage: quotedMessage ? {
                    id: quotedMessage.id,
                    content: quotedMessage.content,
                    member: {
                        name: quotedMessage.member.name,
                        avatar: quotedMessage.member.avatar
                    },
                    timestamp: quotedMessage.timestamp
                } : undefined,
                isDeleted: false
            }
            
            setSendingMessages(prev => ({ ...prev, [tempId]: optimisticMessage }))
            setNewMessage('')
            setChatFiles([])
            setQuotedMessage(null)
            
            try {
                await createCommentMutation.mutateAsync({
                    listId,
                    taskId,
                    content: message,
                    files,
                    mentionedMemberIds,
                    quotedCommentId: messageData.quotedCommentId
                })
                
                setSendingMessages(prev => {
                    const newState = { ...prev }
                    delete newState[tempId]
                    return newState
                })
            } catch (error: any) {
                console.error('Failed to send message:', error)
                
                setSendingMessages(prev => {
                    const newState = { ...prev }
                    delete newState[tempId]
                    return newState
                })
                
                setFailedMessages(prev => ({
                    ...prev,
                    [tempId]: {
                        error: error?.message || 'Failed to send message',
                        originalData: messageData
                    }
                }))
            }
        }
    }

    const handleReply = (message: ChatMessageData) => {
        const quotedMsg: QuotedMessage = {
            id: message.id,
            content: message.message,
            member: {
                id: message.user.memberId,
                name: message.user.name,
                avatar: message.user.avatar || undefined,
            },
            timestamp: message.timestamp
        }
        setQuotedMessage(quotedMsg)
    }

    const handleClearQuote = () => {
        setQuotedMessage(null)
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

    const handleDeleteClick = (messageId: string) => {
        setDeleteConfirmId(messageId)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmId) return
        
        const messageId = deleteConfirmId
        setDeleteConfirmId(null)
        
        setOptimisticDeletes(prev => new Set([...prev, messageId]))
        
        try {
            await deleteCommentMutation.mutateAsync({ listId, taskId, commentId: messageId })
        } catch (error) {
            console.error('Failed to delete message:', error)
            setOptimisticDeletes(prev => {
                const newSet = new Set(prev)
                newSet.delete(messageId)
                return newSet
            })
        }
    }
    
    const handleDeleteCancel = () => {
        setDeleteConfirmId(null)
    }

    const handleRetry = async (tempId: string) => {
        const failedMsg = failedMessages[tempId]
        if (!failedMsg || !workspaceMember) return
        
        const { originalData } = failedMsg
        
        const optimisticMessage: ChatMessageData = {
            id: tempId,
            user: {
                name: 'You',
                avatar: workspaceMember.avatarURL?.sm || workspaceMember.avatarURL?.original || null,
                initials: workspaceMember.firstName && workspaceMember.lastName
                    ? `${workspaceMember.firstName[0]}${workspaceMember.lastName[0]}`
                    : 'Y',
                memberId: workspaceMember._id
            },
            message: originalData.message,
            timestamp: 'Just now',
            isCurrentUser: true,
            onlineStatus: 'online',
            files: originalData.files?.map((file: File, index: number) => ({
                id: `temp-file-${index}`,
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file),
                thumbnailUrl: undefined
            })) || [],
            reactions: [],
            mentionedMembers: originalData.mentionedMemberIds?.map((id: string) => ({ id, label: '', email: '' })) || [],
            quotedMessage: undefined,
            isDeleted: false
        }
        
        setFailedMessages(prev => {
            const newState = { ...prev }
            delete newState[tempId]
            return newState
        })
        
        setSendingMessages(prev => ({ ...prev, [tempId]: optimisticMessage }))
        
        try {
            await createCommentMutation.mutateAsync({
                listId,
                taskId,
                content: originalData.message,
                files: originalData.files,
                mentionedMemberIds: originalData.mentionedMemberIds,
                quotedCommentId: originalData.quotedCommentId
            })
            
            setSendingMessages(prev => {
                const newState = { ...prev }
                delete newState[tempId]
                return newState
            })
        } catch (error: any) {
            console.error('Failed to retry message:', error)
            
            setSendingMessages(prev => {
                const newState = { ...prev }
                delete newState[tempId]
                return newState
            })
            
            setFailedMessages(prev => ({
                ...prev,
                [tempId]: {
                    error: error?.message || 'Failed to send message',
                    originalData
                }
            }))
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
                    <ChatBubbleLoading count={5} showIncoming={true} showOutgoing={true} />
                ) : (
                    <div className="space-y-6 max-w-full">
                        {messages.map((message) => {
                            const isSending = message.id.startsWith('temp-') && !!sendingMessages[message.id]
                            const failedMsg = failedMessages[message.id]
                            const error = failedMsg?.error
                            
                            return (
                                <ChatMessage
                                    key={message.id}
                                    data={message}
                                    isSending={isSending}
                                    error={error}
                                    onRetry={error ? () => handleRetry(message.id) : undefined}
                                    onReactionClick={!message.isDeleted && !isSending && !error ? (emoji, hasReacted) => 
                                        handleReactionClick(message.id, emoji, hasReacted) : undefined
                                    }
                                    onAddReaction={!message.isDeleted && !isSending && !error ? (emoji) => 
                                        handleAddReaction(message.id, emoji) : undefined
                                    }
                                    onReply={!message.isDeleted && !isSending && !error ? () => handleReply(message) : undefined}
                                    onDelete={!message.isDeleted && !isSending && !error ? () => handleDeleteClick(message.id) : undefined}
                                    onCopy={!message.isDeleted && !isSending && !error ? () => handleCopy(message.message) : undefined}
                                    onFileClick={(file) => {
                                        window.open(file.url, '_blank')
                                    }}
                                    showDropdown={!message.isDeleted && !isSending && !error}
                                />
                            )
                        })}
                        
                        {Object.entries(failedMessages).map(([tempId, failedMsg]) => {
                            if (sendingMessages[tempId]) return null
                            
                            const failedMessage: ChatMessageData = {
                                id: tempId,
                                user: {
                                    name: 'You',
                                    avatar: workspaceMember?.avatarURL?.sm || workspaceMember?.avatarURL?.original || null,
                                    initials: workspaceMember?.firstName && workspaceMember?.lastName
                                        ? `${workspaceMember.firstName[0]}${workspaceMember.lastName[0]}`
                                        : 'Y',
                                    memberId: workspaceMember?._id || ''
                                },
                                message: failedMsg.originalData.message,
                                timestamp: 'Failed',
                                isCurrentUser: true,
                                onlineStatus: 'online',
                                files: failedMsg.originalData.files?.map((file: File, index: number) => ({
                                    id: `failed-file-${index}`,
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    url: URL.createObjectURL(file),
                                    thumbnailUrl: undefined
                                })) || [],
                                reactions: [],
                                mentionedMembers: [],
                                isDeleted: false
                            }
                            
                            return (
                                <ChatMessage
                                    key={tempId}
                                    data={failedMessage}
                                    error={failedMsg.error}
                                    onRetry={() => handleRetry(tempId)}
                                    showDropdown={false}
                                />
                            )
                        })}
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
                <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0 z-30">
                <ChatInput
                    value={newMessage}
                    placeholder="Type your message here... (Shift+Enter for new line)"
                    onSend={handleSendMessage}
                    onChange={setNewMessage}
                    files={chatFiles}
                    quotedMessage={quotedMessage}
                    onClearQuote={handleClearQuote}
                    onFilesChange={setChatFiles}
                    showFormatting={true}
                    maxFiles={5}
                    acceptedFileTypes="image/*,application/pdf,.doc,.docx,.txt"
                />
            </div>

            <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && handleDeleteCancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this message? This action cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}