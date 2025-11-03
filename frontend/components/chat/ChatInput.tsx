'use client'

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import FileThumbnailRenderer from '@/components/FileThumbnailRenderer'
import {
    TbBold,
    TbItalic,
    TbCode,
    TbList,
    TbListNumbers,
    TbSend,
    TbPaperclip,
    TbX,
    TbStrikethrough,
    TbMoodSmile,
    TbLink,
    TbPhoto,
    TbAt,
    TbCornerUpLeft,
} from 'react-icons/tb'
import { cn } from '@/lib/utils'
import type { EmojiClickData } from 'emoji-picker-react'
import { EmojiStyle } from 'emoji-picker-react'
import { CustomMention } from './CustomMention'
import { createMentionSuggestion } from './mentionSuggestion'
import type { MentionItem } from './MentionList'
import { useWorkspaceMembers } from '@/hooks/use-workspace-members'
import { QuotedMessage } from '@/hooks/use-comments'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

export interface ChatFile {
    id: string
    file: File
    preview?: string
}

interface ChatInputProps {
    value?: string
    placeholder?: string
    disabled?: boolean
    maxLength?: number
    files?: ChatFile[]
    quotedMessage?: QuotedMessage | null
    onSend: (message: string, files: File[], mentionedMemberIds: string[]) => void
    onChange?: (message: string) => void
    onFilesChange?: (files: ChatFile[]) => void
    onClearQuote?: () => void
    className?: string
    showFormatting?: boolean
    maxFiles?: number
    acceptedFileTypes?: string
}

export default function ChatInput({
    value = '',
    placeholder = 'Type a message...',
    disabled = false,
    maxLength,
    files = [],
    quotedMessage = null,
    onSend,
    onChange,
    onFilesChange,
    onClearQuote,
    className,
    showFormatting = true,
    maxFiles = 10,
    acceptedFileTypes = '*'
}: ChatInputProps) {
    const [attachedFiles, setAttachedFiles] = useState<ChatFile[]>(files)
    const [isFocused, setIsFocused] = useState(false)
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { members: workspaceMembers, isLoading: membersLoading, error: membersError } = useWorkspaceMembers({ limit: 100 })
    
    const membersRef = useRef<any[]>([])
    
    useEffect(() => {
        if (workspaceMembers && workspaceMembers.length > 0) {
            membersRef.current = workspaceMembers
        }
    }, [workspaceMembers])

    const fetchMembers = useCallback(
        async (query: string): Promise<MentionItem[]> => {
            const currentMembers = membersRef.current
            
            if (!currentMembers || currentMembers.length === 0) {
                return []
            }

            const lowerQuery = query.toLowerCase()
            
            const filtered = currentMembers.filter((member: any) => {
                if (!lowerQuery) return true
                
                const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim().toLowerCase()
                const firstName = (member.firstName || '').toLowerCase()
                const lastName = (member.lastName || '').toLowerCase()
                const email = (member.primaryEmail || '').toLowerCase()
                
                return (
                    fullName.includes(lowerQuery) ||
                    firstName.includes(lowerQuery) ||
                    lastName.includes(lowerQuery) ||
                    email.includes(lowerQuery)
                )
            })

            const result = filtered.map((member: any) => {
                const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim()
                return {
                    id: member._id,
                    label: fullName || member.primaryEmail,
                    email: member.primaryEmail,
                    avatar: member.avatarURL?.original || member.avatarURL?.sm,
                }
            })

            return result
        },
        []
    )

    const mentionSuggestion = useMemo(
        () => createMentionSuggestion(fetchMembers),
        [fetchMembers]
    )

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                horizontalRule: false,
                blockquote: false,
            }),
            Placeholder.configure({
                placeholder
            }),
            CustomMention.configure({
                suggestion: mentionSuggestion,
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const markdown = editor.getText()
            onChange?.(markdown)
        },
        onCreate: ({ editor }) => {
            if (value) {
                editor.commands.setContent(value)
            }
        }
    })

    const handleSend = useCallback(() => {
        if (!editor) return

        const text = editor.getText().trim()
        if (!text && attachedFiles.length === 0) return

        const mentionedMemberIds: string[] = []
        editor.state.doc.descendants((node) => {
            if (node.type.name === 'mention' && node.attrs.id) {
                mentionedMemberIds.push(node.attrs.id)
            }
        })

        const uniqueMemberIds = [...new Set(mentionedMemberIds)]
        const filesToSend = attachedFiles.map(f => f.file)
        const htmlContent = editor.getHTML()
        onSend(htmlContent, filesToSend, uniqueMemberIds)

        editor.commands.clearContent()
        setAttachedFiles([])
    }, [editor, attachedFiles, onSend])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }, [handleSend])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (selectedFiles.length === 0) return

        const remainingSlots = maxFiles - attachedFiles.length
        const filesToAdd = selectedFiles.slice(0, remainingSlots)

        const newFiles: ChatFile[] = filesToAdd.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        }))

        const updatedFiles = [...attachedFiles, ...newFiles]
        setAttachedFiles(updatedFiles)
        onFilesChange?.(updatedFiles)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [attachedFiles, maxFiles, onFilesChange]);

    const handleRemoveFile = useCallback((fileId: string) => {
        const updatedFiles = attachedFiles.filter(f => f.id !== fileId)
        setAttachedFiles(updatedFiles)
        onFilesChange?.(updatedFiles)
    }, [attachedFiles, onFilesChange])

    const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
        if (!editor) return
        editor.chain().focus().insertContent(emojiData.emoji).run()
        setEmojiPickerOpen(false)
    }, [editor])

    const canSend = editor?.getText().trim() || attachedFiles.length > 0

    return (
        <TooltipProvider>
            <div
                className={cn(
                    'flex flex-col rounded-lg border bg-background transition-all duration-200',
                    isFocused ? 'ring-2 ring-primary border-primary' : 'border-input',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                {quotedMessage && (
                    <div className="px-3 py-2.5 bg-secondary/5 flex items-start gap-3 group">
                        <div className="flex-shrink-0 pt-0.5">
                            <TbCornerUpLeft className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-secondary">
                                    Replying to {quotedMessage.member.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {quotedMessage.timestamp}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                                {quotedMessage.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                                {quotedMessage.content.length > 150 && '...'}
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onClearQuote}
                            className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                        >
                            <TbX className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}

                {showFormatting && (
                    <div className="flex items-center gap-0.5 px-3 py-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                    data-active={editor?.isActive('bold')}
                                    disabled={disabled}
                                    className="h-7 w-7 p-0 hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                >
                                    <TbBold className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Bold</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                    data-active={editor?.isActive('italic')}
                                    disabled={disabled}
                                    className="h-7 w-7 p-0 hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                >
                                    <TbItalic className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Italic</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                    data-active={editor?.isActive('strike')}
                                    disabled={disabled}
                                    className="h-7 w-7 p-0 hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                >
                                    <TbStrikethrough className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Strikethrough</p>
                            </TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-5 mx-1" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                    data-active={editor?.isActive('bulletList')}
                                    disabled={disabled}
                                    className="h-7 w-7 p-0 hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                >
                                    <TbList className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Bullet List</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                    data-active={editor?.isActive('orderedList')}
                                    disabled={disabled}
                                    className="h-7 w-7 p-0 hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                >
                                    <TbListNumbers className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Numbered List</p>
                            </TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-5 mx-1" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor?.chain().focus().toggleCode().run()}
                                    data-active={editor?.isActive('code')}
                                    disabled={disabled}
                                    className="h-7 w-7 p-0 hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                >
                                    <TbCode className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Code</p>
                            </TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-5 mx-1" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editor?.chain().focus().insertContent('@').run()}
                                    disabled={disabled}
                                    className="h-7 w-7 p-0 hover:bg-accent"
                                >
                                    <TbAt className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Mention</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={disabled}
                                    className="h-7 w-7 p-0 hover:bg-accent"
                                >
                                    <TbLink className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Link</p>
                            </TooltipContent>
                        </Tooltip>

                        {maxLength && editor && (
                            <div className="ml-auto">
                                <span className={cn(
                                    'text-xs tabular-nums',
                                    editor.getText().length > maxLength * 0.9
                                        ? 'text-yellow-600'
                                        : 'text-muted-foreground',
                                    editor.getText().length >= maxLength
                                        ? 'text-destructive font-medium'
                                        : ''
                                )}>
                                    {editor.getText().length}/{maxLength}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {attachedFiles.length > 0 && (
                    <div className="border-t border-border px-3 py-3">
                        <Carousel
                            opts={{
                                align: 'start',
                                loop: false,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2">
                                {attachedFiles.map((file) => {
                                    const isImage = file.file.type.startsWith('image/')
                                    return (
                                        <CarouselItem key={file.id} className="pl-2 basis-auto">
                                            <div className="relative group flex items-center gap-2 p-2 pr-8 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                                {isImage && file.preview ? (
                                                    <FileThumbnailRenderer
                                                        fileType={file.file.name}
                                                        mimeType={file.file.type}
                                                        preview={file.preview}
                                                        size="sm"
                                                    />
                                                ) : (
                                                    <FileThumbnailRenderer
                                                        fileType={file.file.name}
                                                        mimeType={file.file.type}
                                                        size="sm"
                                                    />
                                                )}
                                                <div className="flex flex-col min-w-0 max-w-[120px]">
                                                    <span className="text-xs font-medium truncate">
                                                        {file.file.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {(file.file.size / 1024).toFixed(1)} KB
                                                    </span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveFile(file.id)}
                                                    className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <TbX className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CarouselItem>
                                    )
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="-left-3" />
                            <CarouselNext className="-right-3" />
                        </Carousel>
                    </div>
                )}

                <div className="relative">
                    <EditorContent
                        editor={editor}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            'px-3 py-3',
                            '[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:max-h-[200px]',
                            '[&_.ProseMirror]:overflow-y-auto',
                            '[&_.ProseMirror_p]:my-0 [&_.ProseMirror_p]:leading-6 [&_.ProseMirror_p]:text-sm',
                            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
                            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground',
                            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
                            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
                            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
                            '[&_.ProseMirror_strong]:font-bold',
                            '[&_.ProseMirror_em]:italic',
                            '[&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5',
                            '[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono',
                            '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-1',
                            '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-1',
                            '[&_.ProseMirror_li]:my-0.5',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    />
                </div>

                <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <div className="flex items-center gap-1">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={acceptedFileTypes}
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={disabled || attachedFiles.length >= maxFiles}
                        />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={disabled || attachedFiles.length >= maxFiles}
                                    className="h-8 w-8 p-0 hover:bg-accent"
                                >
                                    <TbPaperclip className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Attach files</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={disabled}
                                            className="h-8 w-8 p-0 hover:bg-accent"
                                        >
                                            <TbMoodSmile className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0 border-0"
                                        align="start"
                                        side="top"
                                    >
                                        <EmojiPicker
                                            onEmojiClick={handleEmojiClick}
                                            autoFocusSearch={false}
                                            width={350}
                                            height={400}
                                            emojiStyle={EmojiStyle.APPLE}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Add emoji</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                onClick={handleSend}
                                disabled={disabled || !canSend}
                                size="sm"
                                className="h-8 px-4 gap-1.5 font-medium"
                            >
                                <TbSend className="h-4 w-4" />
                                <span>Send</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>Send message (Enter)</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    )
}
