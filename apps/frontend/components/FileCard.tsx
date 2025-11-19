'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TbEye, TbEdit, TbTrash, TbDownload, TbDots } from 'react-icons/tb'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FileThumbnailRenderer from '@/components/FileThumbnailRenderer'
import { formatDistanceToNow } from 'date-fns'

interface FileCardProps {
    file: {
        _id: string
        name: string
        size: number
        mimeType: string
        fileURL: string
        createdAt: string
        uploadedBy?: {
            _id: string
            firstName: string
            lastName: string
        }
    }
    size?: 'large' | 'small'
    onView?: (file: FileCardProps['file']) => void
    onEdit?: (file: FileCardProps['file']) => void
    onDelete?: (file: FileCardProps['file']) => void
    onDownload?: (file: FileCardProps['file']) => void
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function FileCard({ 
    file, 
    size = 'small',
    onView,
    onEdit,
    onDelete,
    onDownload
}: FileCardProps) {
    const isLarge = size === 'large'
    
    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation()
        onView?.(file)
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        onEdit?.(file)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDelete?.(file)
    }

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDownload?.(file)
    }
    
    return (
        <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isLarge ? 'p-4' : 'p-3'} group`}>
            <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 ${isLarge ? 'w-16 h-16' : 'w-12 h-12'}`}>
                    <FileThumbnailRenderer 
                        mimeType={file.mimeType}
                        fileType={file.name}
                    />
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${isLarge ? 'text-base' : 'text-sm'}`}>
                        {file.name}
                    </h3>
                    <div className={`flex items-center gap-2 text-muted-foreground ${isLarge ? 'text-sm' : 'text-xs'}`}>
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>
                            {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    {isLarge && file.uploadedBy && (
                        <p className="text-xs text-muted-foreground mt-1">
                            By {file.uploadedBy.firstName} {file.uploadedBy.lastName}
                        </p>
                    )}
                </div>
                
                <div className="flex-shrink-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <TbDots className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onView && (
                                <DropdownMenuItem onClick={handleView}>
                                    <TbEye className="mr-2 h-4 w-4" />
                                    View
                                </DropdownMenuItem>
                            )}
                            {onDownload && (
                                <DropdownMenuItem onClick={handleDownload}>
                                    <TbDownload className="mr-2 h-4 w-4" />
                                    Download
                                </DropdownMenuItem>
                            )}
                            {onEdit && (
                                <DropdownMenuItem onClick={handleEdit}>
                                    <TbEdit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                                        <TbTrash className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    )
}
