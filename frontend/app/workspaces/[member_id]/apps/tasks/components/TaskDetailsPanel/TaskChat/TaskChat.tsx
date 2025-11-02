'use client'

import React, { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import ChatInput, { ChatFile } from '@/components/ChatInput'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TbMessageCircle, TbDots, TbEdit, TbTrash, TbCopy, TbFlag } from 'react-icons/tb'

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

export default function TaskChat() {
    const [newMessage, setNewMessage] = useState('')
    const [chatFiles, setChatFiles] = useState<ChatFile[]>([])

    const handleSendMessage = (message: string, files: File[]) => {
        if (message.trim() || files.length > 0) {
            console.log('Sending message:', message)
            console.log('Sending files:', files)
            
            setNewMessage('')
            setChatFiles([])
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-background/80 backdrop-blur-sm top-0 sticky z-30">
                <h3 className="font-semibold text-lg">Task Discussion</h3>
                <p className="text-sm text-muted-foreground">Collaborate with your team on this task</p>
            </div>

            <ScrollArea className="flex-1 p-4">
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

                            <div className={`flex-1 max-w-[80%] ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
                                <div className={`relative rounded-lg p-3 ${message.isCurrentUser
                                    ? 'bg-primary/20 text-primary-foreground ml-auto'
                                    : 'bg-muted'
                                    }`}>
                                    {!message.isCurrentUser && (
                                        <div className="font-medium text-sm mb-1">{message.user.name}</div>
                                    )}
                                    <div className="text-sm whitespace-pre-wrap pr-6">{message.message}</div>
                                    
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
                />
            </div>
        </div>
    )
}
