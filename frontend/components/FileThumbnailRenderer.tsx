
import Image from 'next/image'
import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
    fileType?: string
    mimeType?: string
    preview?: string
    size?: 'sm' | 'md' | 'lg'
}

const getFileTypeIcon = (mimeType?: string, fileName?: string): string => {
    if (!mimeType && !fileName) return '/files/default.svg'
    
    const type = mimeType?.toLowerCase() || ''
    const name = fileName?.toLowerCase() || ''
    
    if (type.includes('pdf') || name.endsWith('.pdf')) {
        return '/files/pdf.svg'
    }
    
    if (type.includes('csv') || name.endsWith('.csv')) {
        return '/files/csv.svg'
    }
    
    if (type.includes('spreadsheet') || 
        type.includes('excel') || 
        name.endsWith('.xlsx') || 
        name.endsWith('.xls') ||
        name.endsWith('.ods')) {
        return '/files/excel.svg'
    }
    
    if (type.includes('document') || 
        type.includes('word') || 
        name.endsWith('.docx') || 
        name.endsWith('.doc') ||
        name.endsWith('.odt') ||
        name.endsWith('.rtf')) {
        return '/files/doc.svg'
    }
    
    if (type.includes('presentation') || 
        type.includes('powerpoint') || 
        name.endsWith('.pptx') || 
        name.endsWith('.ppt') ||
        name.endsWith('.odp')) {
        return '/files/presentation.svg'
    }
    
    if (type.startsWith('image/') || 
        name.match(/\.(jpg|jpeg|png|gif|bmp|svg|webp|ico|tiff)$/)) {
        return '/files/image.svg'
    }
    
    if (type.startsWith('video/') || 
        name.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v)$/)) {
        return '/files/video.svg'
    }
    
    if (type.startsWith('audio/') || 
        name.match(/\.(mp3|wav|flac|aac|ogg|wma|m4a)$/)) {
        return '/files/audio.svg'
    }
    
    if (type.includes('zip') || type.includes('archive') ||
        name.match(/\.(zip|rar|7z|tar|gz|bz2)$/)) {
        return '/files/archive.svg'
    }
    
    if (type.includes('text') || 
        name.match(/\.(txt|md|json|xml|html|css|js|ts|py|java|cpp|c|php)$/)) {
        return '/files/code.svg'
    }
    
    return '/files/default.svg'
}

export default function FileThumbnailRenderer({ fileType, mimeType, preview, size = 'md' }: Props) {
    const iconSrc = getFileTypeIcon(mimeType, fileType)
    const isImage = mimeType?.startsWith('image/')
    
    const sizeClasses = {
        sm: 'h-10 w-10',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    }
    
    const imageSizes = {
        sm: 40,
        md: 48,
        lg: 64
    }
    
    return (
        <div className={cn('rounded-md overflow-hidden flex items-center justify-center relative flex-shrink-0', sizeClasses[size])}>
            {isImage && preview ? (
                <Image
                    src={preview}
                    alt="File preview"
                    width={imageSizes[size]}
                    height={imageSizes[size]}
                    className="object-cover w-full h-full"
                />
            ) : (
                <Image
                    src={iconSrc}
                    alt="File thumbnail"
                    width={imageSizes[size]}
                    height={imageSizes[size]}
                    className="object-contain w-full h-full"
                />
            )}
        </div>
    )
}
