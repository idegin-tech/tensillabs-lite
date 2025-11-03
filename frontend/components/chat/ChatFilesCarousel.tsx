'use client'

import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import FileThumbnailRenderer from '@/components/FileThumbnailRenderer'
import { cn } from '@/lib/utils'
import { TbDownload, TbExternalLink } from 'react-icons/tb'

export interface ChatFile {
    id: string
    name: string
    size: number
    type: string
    url: string
    thumbnailUrl?: string
}

export interface ChatFilesCarouselProps {
    files: ChatFile[]
    isOutgoing?: boolean
    onFileClick?: (file: ChatFile) => void
    onDownload?: (file: ChatFile) => void
    className?: string
}

export default function ChatFilesCarousel({
    files,
    isOutgoing = false,
    onFileClick,
    onDownload,
    className,
}: ChatFilesCarouselProps) {
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const handleDownload = (e: React.MouseEvent, file: ChatFile) => {
        e.stopPropagation()
        if (onDownload) {
            onDownload(file)
        } else {
            const link = document.createElement('a')
            link.href = file.url
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    if (files.length === 0) return null

    if (files.length === 1) {
        const file = files[0]
        return (
            <div
                className={cn(
                    'group relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                    'hover:shadow-sm cursor-pointer',
                    isOutgoing
                        ? 'bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/15'
                        : 'bg-background/80 border-border hover:bg-background',
                    className
                )}
                onClick={() => onFileClick?.(file)}
            >
                <div className="flex-shrink-0">
                    <FileThumbnailRenderer
                        fileType={file.name}
                        mimeType={file.type}
                        preview={file.type.startsWith('image/') ? file.url : file.thumbnailUrl}
                        size="md"
                    />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <span className={cn(
                        'text-sm font-medium truncate',
                        isOutgoing ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                        {file.name}
                    </span>
                    <span className={cn(
                        'text-xs',
                        isOutgoing ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                        {formatFileSize(file.size)}
                    </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => handleDownload(e, file)}
                        className={cn(
                            'p-1.5 rounded-md transition-colors',
                            isOutgoing
                                ? 'hover:bg-primary-foreground/20'
                                : 'hover:bg-muted'
                        )}
                        title="Download"
                    >
                        <TbDownload className="h-4 w-4" />
                    </button>
                    {file.type.startsWith('image/') && (
                        <button
                            onClick={() => onFileClick?.(file)}
                            className={cn(
                                'p-1.5 rounded-md transition-colors',
                                isOutgoing
                                    ? 'hover:bg-primary-foreground/20'
                                    : 'hover:bg-muted'
                            )}
                            title="Open"
                        >
                            <TbExternalLink className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={cn('relative', className)}>
            <Carousel
                opts={{
                    align: 'start',
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2">
                    {files.map((file) => (
                        <CarouselItem key={file.id} className="pl-2 basis-auto">
                            <div
                                className={cn(
                                    'group relative flex items-center gap-2 p-2.5 rounded-lg border transition-all duration-200',
                                    'hover:shadow-sm cursor-pointer',
                                    isOutgoing
                                        ? 'bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/15'
                                        : 'bg-background/80 border-border hover:bg-background'
                                )}
                                onClick={() => onFileClick?.(file)}
                            >
                                <div className="flex-shrink-0">
                                    <FileThumbnailRenderer
                                        fileType={file.name}
                                        mimeType={file.type}
                                        preview={file.type.startsWith('image/') ? file.url : file.thumbnailUrl}
                                        size="sm"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0 max-w-[140px]">
                                    <span className={cn(
                                        'text-xs font-medium truncate',
                                        isOutgoing ? 'text-primary-foreground' : 'text-foreground'
                                    )}>
                                        {file.name}
                                    </span>
                                    <span className={cn(
                                        'text-xs',
                                        isOutgoing ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                    )}>
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleDownload(e, file)}
                                    className={cn(
                                        'absolute top-1 right-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all',
                                        isOutgoing
                                            ? 'hover:bg-primary-foreground/20'
                                            : 'hover:bg-muted'
                                    )}
                                    title="Download"
                                >
                                    <TbDownload className="h-3 w-3" />
                                </button>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="-left-3 h-7 w-7 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
                <CarouselNext className="-right-3 h-7 w-7 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
            </Carousel>
        </div>
    )
}
