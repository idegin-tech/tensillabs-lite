'use client'

import React from 'react'
import ChatBubbleContainer from './ChatBubbleContainer'
import IncomingChatBubble from './IncomingChatBubble'
import OutgoingChatBubble from './OutgoingChatBubble'
import ChatFilesCarousel, { ChatFile } from './ChatFilesCarousel'
import type { OnlineStatus, ChatReaction } from './ChatBubbleContainer'

export interface ChatMessageData {
    id: string
    message: string
    isCurrentUser: boolean
    user: {
        name: string
        avatar?: string | null
        initials: string
        memberId: string
    }
    timestamp: string
    onlineStatus?: OnlineStatus
    files?: ChatFile[]
    reactions?: ChatReaction[]
    mentionedMembers?: Array<{ id: string; label: string; email?: string }>
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
}

export interface ChatMessageProps {
    data: ChatMessageData
    isSending?: boolean
    error?: string
    onRetry?: () => void
    onReactionClick?: (emoji: string, hasReacted: boolean) => void
    onAddReaction?: (emoji: string) => void
    onReply?: () => void
    onEdit?: () => void
    onDelete?: () => void
    onCopy?: () => void
    onReport?: () => void
    onFileClick?: (file: ChatFile) => void
    onFileDownload?: (file: ChatFile) => void
    showAvatar?: boolean
    showDropdown?: boolean
    className?: string
}

export default function ChatMessage({
    data,
    isSending = false,
    error,
    onRetry,
    onReactionClick,
    onAddReaction,
    onReply,
    onEdit,
    onDelete,
    onCopy,
    onReport,
    onFileClick,
    onFileDownload,
    showAvatar = true,
    showDropdown = true,
    className,
}: ChatMessageProps) {
    const filesCarousel = data.files && data.files.length > 0 ? (
        <ChatFilesCarousel
            files={data.files}
            isOutgoing={data.isCurrentUser}
            onFileClick={onFileClick}
            onDownload={onFileDownload}
        />
    ) : undefined

    const BubbleComponent = data.isCurrentUser ? OutgoingChatBubble : IncomingChatBubble

    return (
        <ChatBubbleContainer
            avatar={data.user.avatar}
            initials={data.user.initials}
            name={data.user.name}
            timestamp={data.timestamp}
            isCurrentUser={data.isCurrentUser}
            onlineStatus={data.onlineStatus}
            showAvatar={showAvatar}
            reactions={data.reactions}
            onReactionClick={onReactionClick}
            onAddReaction={onAddReaction}
            onReply={onReply}
            onEdit={data.isCurrentUser ? onEdit : undefined}
            onDelete={data.isCurrentUser ? onDelete : undefined}
            onCopy={onCopy}
            onReport={!data.isCurrentUser ? onReport : undefined}
            showDropdown={showDropdown}
            className={className}
        >
            <BubbleComponent
                message={data.message}
                files={filesCarousel}
                isSending={data.isCurrentUser ? isSending : undefined}
                mentionedMembers={data.mentionedMembers}
                quotedMessage={data.quotedMessage}
                isDeleted={data.isDeleted}
                error={data.isCurrentUser ? error : undefined}
                onRetry={data.isCurrentUser ? onRetry : undefined}
            />
        </ChatBubbleContainer>
    )
}
