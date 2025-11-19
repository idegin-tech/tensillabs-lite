'use client'

import React from 'react'
import { ChatMessage, ChatBubbleLoading } from '@/components/chat'
import type { ChatMessageData } from '@/components/chat'

const mockMessages: ChatMessageData[] = [
  {
    id: '1',
    message: 'Hey team! I just finished the design mockups for the new dashboard. What do you think?',
    isCurrentUser: false,
    user: {
      name: 'Sarah Johnson',
      avatar: null,
      initials: 'SJ',
      memberId: 'user-1'
    },
    timestamp: '10:30 AM',
    onlineStatus: 'online',
    files: [
      {
        id: 'file-1',
        name: 'dashboard-mockup-v1.png',
        size: 2456789,
        type: 'image/png',
        url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Dashboard+Mockup',
        thumbnailUrl: 'https://placehold.co/200x200/e2e8f0/1e293b?text=Dashboard'
      },
      {
        id: 'file-2',
        name: 'design-specs.pdf',
        size: 1234567,
        type: 'application/pdf',
        url: '#'
      }
    ],
    reactions: [
      { emoji: '👍', count: 3, hasReacted: false, memberIds: ['user-2', 'user-3', 'user-4'] },
      { emoji: '🎨', count: 2, hasReacted: false, memberIds: ['user-2', 'user-4'] }
    ]
  },
  {
    id: '2',
    message: 'This looks amazing! I love the color scheme and the layout is very intuitive.',
    isCurrentUser: true,
    user: {
      name: 'You',
      avatar: null,
      initials: 'ME',
      memberId: 'current-user'
    },
    timestamp: '10:32 AM',
    onlineStatus: 'online',
    reactions: [
      { emoji: '❤️', count: 1, hasReacted: false, memberIds: ['user-1'] }
    ]
  },
  {
    id: '3',
    message: 'I agree! The dashboard is looking great. Just one question - could we add a dark mode toggle?',
    isCurrentUser: false,
    user: {
      name: 'Mike Chen',
      avatar: null,
      initials: 'MC',
      memberId: 'user-3'
    },
    timestamp: '10:35 AM',
    onlineStatus: 'recently',
    reactions: []
  },
  {
    id: '4',
    message: 'Good idea! Let me work on that and I\'ll share an updated version by end of day.',
    isCurrentUser: true,
    user: {
      name: 'You',
      avatar: null,
      initials: 'ME',
      memberId: 'current-user'
    },
    timestamp: '10:37 AM',
    onlineStatus: 'online'
  },
  {
    id: '5',
    message: 'Perfect! Also attaching the latest user research findings that might be helpful.',
    isCurrentUser: false,
    user: {
      name: 'Emily Rodriguez',
      avatar: null,
      initials: 'ER',
      memberId: 'user-4'
    },
    timestamp: '10:40 AM',
    onlineStatus: 'offline',
    files: [
      {
        id: 'file-3',
        name: 'user-research-q4-2024.pdf',
        size: 3456789,
        type: 'application/pdf',
        url: '#'
      }
    ],
    reactions: [
      { emoji: '👏', count: 2, hasReacted: true, memberIds: ['current-user', 'user-2'] }
    ]
  }
]

export default function ChatDemo() {
  const [messages, setMessages] = React.useState<ChatMessageData[]>(mockMessages)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleReactionClick = (messageId: string, emoji: string, hasReacted: boolean) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg
      
      const reactions = msg.reactions || []
      const reactionIndex = reactions.findIndex(r => r.emoji === emoji)
      
      if (reactionIndex === -1) return msg
      
      const updatedReactions = [...reactions]
      const reaction = updatedReactions[reactionIndex]
      
      if (hasReacted) {
        reaction.count--
        reaction.hasReacted = false
        reaction.memberIds = reaction.memberIds.filter(id => id !== 'current-user')
        
        if (reaction.count === 0) {
          updatedReactions.splice(reactionIndex, 1)
        }
      } else {
        reaction.count++
        reaction.hasReacted = true
        reaction.memberIds.push('current-user')
      }
      
      return { ...msg, reactions: updatedReactions }
    }))
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg
      
      const reactions = msg.reactions || []
      const existingReaction = reactions.find(r => r.emoji === emoji)
      
      if (existingReaction) {
        if (!existingReaction.hasReacted) {
          existingReaction.count++
          existingReaction.hasReacted = true
          existingReaction.memberIds.push('current-user')
        }
        return { ...msg, reactions: [...reactions] }
      }
      
      return {
        ...msg,
        reactions: [
          ...reactions,
          { emoji, count: 1, hasReacted: true, memberIds: ['current-user'] }
        ]
      }
    }))
  }

  const handleEdit = (messageId: string) => {
    console.log('Edit message:', messageId)
  }

  const handleDelete = (messageId: string) => {
    console.log('Delete message:', messageId)
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message)
    console.log('Copied to clipboard:', message)
  }

  const handleReport = (messageId: string) => {
    console.log('Report message:', messageId)
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Chat Component Demo - Loading</h2>
        <div className="border rounded-lg p-6 bg-background">
          <ChatBubbleLoading count={4} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Chat Component Demo</h2>
        <p className="text-muted-foreground">
          Demonstration of the chat bubble components with various features
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-background space-y-6">
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
            onEdit={() => handleEdit(message.id)}
            onDelete={() => handleDelete(message.id)}
            onCopy={() => handleCopy(message.message)}
            onReport={() => handleReport(message.id)}
            onFileClick={(file) => {
              console.log('File clicked:', file)
              window.open(file.url, '_blank')
            }}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            setIsLoading(true)
            setTimeout(() => setIsLoading(false), 2000)
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Test Loading State
        </button>
        
        <button
          onClick={() => setMessages(mockMessages)}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
        >
          Reset Messages
        </button>
      </div>

      <div className="border rounded-lg p-6 bg-muted/30 space-y-4">
        <h3 className="font-semibold text-lg">Features Demonstrated:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✅ Incoming and outgoing message bubbles</li>
          <li>✅ Online status indicators (online, offline, recently)</li>
          <li>✅ File attachments with carousel</li>
          <li>✅ Reactions (add, remove, toggle)</li>
          <li>✅ Dropdown menus with actions</li>
          <li>✅ Avatar with initials fallback</li>
          <li>✅ Timestamp display</li>
          <li>✅ Hover effects and transitions</li>
          <li>✅ Loading skeleton states</li>
        </ul>
      </div>
    </div>
  )
}
