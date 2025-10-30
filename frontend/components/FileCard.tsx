'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TbEye, TbEdit, TbTrash, TbDownload } from 'react-icons/tb'
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
    
    return (
        <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isLarge ? 'p-4' : 'p-3'}`}>
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
                
                <div className="flex items-center gap-1 flex-shrink-0">
                    {onDownload && (
                        <Button
                            variant="ghost"
                            size={isLarge ? 'default' : 'sm'}
                            onClick={() => onDownload(file)}
                            className={isLarge ? 'h-9 w-9' : 'h-8 w-8'}
                        >
                            <TbDownload className={isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
                        </Button>
                    )}
                    {onView && (
                        <Button
                            variant="ghost"
                            size={isLarge ? 'default' : 'sm'}
                            onClick={() => onView(file)}
                            className={isLarge ? 'h-9 w-9' : 'h-8 w-8'}
                        >
                            <TbEye className={isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size={isLarge ? 'default' : 'sm'}
                            onClick={() => onEdit(file)}
                            className={isLarge ? 'h-9 w-9' : 'h-8 w-8'}
                        >
                            <TbEdit className={isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size={isLarge ? 'default' : 'sm'}
                            onClick={() => onDelete(file)}
                            className={`${isLarge ? 'h-9 w-9' : 'h-8 w-8'} hover:bg-destructive/10 hover:text-destructive`}
                        >
                            <TbTrash className={isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    )
}
