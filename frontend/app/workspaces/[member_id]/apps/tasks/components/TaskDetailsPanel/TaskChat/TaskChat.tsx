'use client'

import React, { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TbSend, TbMessageCircle, TbPaperclip, TbPhoto } from 'react-icons/tb'

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
    }
]

export default function TaskChat() {
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setNewMessage('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
                <h3 className="font-semibold text-lg">Task Discussion</h3>
                <p className="text-sm text-muted-foreground">Collaborate with your team on this task</p>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}
                        >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={message.user.avatar || undefined} />
                                <AvatarFallback className="text-xs">{message.user.initials}</AvatarFallback>
                            </Avatar>

                            <div className={`flex-1 max-w-[80%] ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
                                <div className={`rounded-lg p-3 ${message.isCurrentUser
                                    ? 'bg-primary/20 text-primary-foreground ml-auto'
                                    : 'bg-muted'
                                    }`}>
                                    {!message.isCurrentUser && (
                                        <div className="font-medium text-sm mb-1">{message.user.name}</div>
                                    )}
                                    <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                                </div>
                                <div className={`text-xs text-muted-foreground mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'
                                    }`}>
                                    {message.timestamp}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <TbMessageCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h4 className="font-medium mb-2">No messages yet</h4>
                        <p className="text-sm text-muted-foreground">Start a conversation about this task</p>
                    </div>
                )}
            </ScrollArea>

            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="min-h-[60px] max-h-[120px] resize-none pr-20"
                            rows={2}
                        />
                        <div className="absolute right-2 bottom-2 flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <TbPaperclip className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <TbPhoto className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="self-end"
                        size="sm"
                    >
                        <TbSend className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
