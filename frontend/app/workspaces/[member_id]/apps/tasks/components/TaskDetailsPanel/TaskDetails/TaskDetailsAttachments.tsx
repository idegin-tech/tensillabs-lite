'use client'
import React, { useState } from 'react'
import { TbPaperclip, TbUpload, TbFile, TbFileText, TbPhoto, TbVideo, TbMusic, TbDownload, TbEdit, TbTrash, TbDots } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Attachment {
    id: string
    name: string
    type: string
    size: number
    url?: string
    uploadedAt: string
}

interface TaskDetailsAttachmentsProps {
    attachments?: Attachment[]
    onAttachmentsChange?: (attachments: Attachment[]) => void
}

const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <TbPhoto className="h-5 w-5 text-blue-500" />
    if (type.startsWith('video/')) return <TbVideo className="h-5 w-5 text-purple-500" />
    if (type.startsWith('audio/')) return <TbMusic className="h-5 w-5 text-green-500" />
    if (type.includes('text') || type.includes('document')) return <TbFileText className="h-5 w-5 text-orange-500" />
    return <TbFile className="h-5 w-5 text-gray-500" />
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeLabel = (type: string) => {
    const parts = type.split('/')
    return parts[parts.length - 1].toUpperCase()
}

export default function TaskDetailsAttachments({ attachments = [], onAttachmentsChange }: TaskDetailsAttachmentsProps) {
    const [files, setFiles] = useState<Attachment[]>(attachments.length > 0 ? attachments : [
        {
            id: '1',
            name: 'authentication-flow-diagram.png',
            type: 'image/png',
            size: 245760,
            uploadedAt: '2024-01-15T10:30:00Z'
        },
        {
            id: '2',
            name: 'oauth-implementation-guide.pdf',
            type: 'application/pdf',
            size: 1048576,
            uploadedAt: '2024-01-14T16:45:00Z'
        },
        {
            id: '3',
            name: 'api-documentation.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 524288,
            uploadedAt: '2024-01-13T09:15:00Z'
        },
        {
            id: '4',
            name: 'database-schema.sql',
            type: 'application/sql',
            size: 8192,
            uploadedAt: '2024-01-12T14:20:00Z'
        }
    ])

    const [isDragOver, setIsDragOver] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        
        const droppedFiles = Array.from(e.dataTransfer.files)
        const newAttachments: Attachment[] = droppedFiles.map(file => ({
            id: Date.now() + Math.random().toString(),
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString()
        }))
        
        const updatedFiles = [...files, ...newAttachments]
        setFiles(updatedFiles)
        onAttachmentsChange?.(updatedFiles)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        const newAttachments: Attachment[] = selectedFiles.map(file => ({
            id: Date.now() + Math.random().toString(),
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString()
        }))
        
        const updatedFiles = [...files, ...newAttachments]
        setFiles(updatedFiles)
        onAttachmentsChange?.(updatedFiles)
        
        e.target.value = ''
    }

    const handleDeleteFile = (fileId: string) => {
        const updatedFiles = files.filter(file => file.id !== fileId)
        setFiles(updatedFiles)
        onAttachmentsChange?.(updatedFiles)
    }

    const handleDownloadFile = (file: Attachment) => {
        console.log('Download file:', file.name)
    }

    const handleEditFile = (file: Attachment) => {
        console.log('Edit file:', file.name)
    }

    return (
        <div className="space-y-6">
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
                    isDragOver
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/30"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                        isDragOver ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                        <TbUpload className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            {isDragOver ? "Drop files here" : "Drop files or click to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Supports all file types up to 10MB
                        </p>
                    </div>                    <div className="relative">
                        <Button variant="outline" size="sm" className="cursor-pointer">
                            <TbPaperclip className="h-4 w-4 mr-2" />
                            Choose Files
                        </Button>
                        <input
                            type="file"
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="group flex items-start space-x-3 p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex-shrink-0">
                                {getFileIcon(file.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-start justify-between">
                                    <h4 className="text-sm font-medium text-foreground truncate pr-2">
                                        {file.name}
                                    </h4>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 flex-shrink-0"
                                            >
                                                <TbDots className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem
                                                onClick={() => handleDownloadFile(file)}
                                                className="flex items-center gap-2"
                                            >
                                                <TbDownload className="h-4 w-4" />
                                                Download
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleEditFile(file)}
                                                className="flex items-center gap-2"
                                            >
                                                <TbEdit className="h-4 w-4" />
                                                Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteFile(file.id)}
                                                className="flex items-center gap-2 text-destructive"
                                            >
                                                <TbTrash className="h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {getFileTypeLabel(file.type)}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                                
                                <p className="text-xs text-muted-foreground">
                                    Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {files.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <TbPaperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No attachments yet</p>
                </div>
            )}
        </div>
    )
}
