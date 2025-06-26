'use client'
import React, { useState, useRef } from 'react'
import { TbPaperclip, TbUpload, TbFile, TbFileText, TbPhoto, TbVideo, TbMusic, TbDownload, TbTrash, TbDots } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { useUploadTaskFiles } from '@/hooks/use-task-files'
import { toast } from 'sonner'
import FileThumbnailRenderer from '@/components/FileThumbnailRenderer'
interface FileItem {
    _id: string
    name: string
    size: number
    mimeType: string
    fileURL: string
    fileKey: string
    task: string
    workspace: string
    space: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

interface TaskDetailsAttachmentsProps {
    files?: FileItem[]
    taskId: string
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function TaskDetailsAttachments({ files = [], taskId }: TaskDetailsAttachmentsProps) {
    const params = useParams()
    const listId = params.list_id as string
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    
    const uploadTaskFiles = useUploadTaskFiles(listId, taskId)

    const handleFileUpload = (uploadFiles: File[]) => {
        if (uploadFiles.length === 0) return

        const oversizedFiles = uploadFiles.filter(file => file.size > 10 * 1024 * 1024)
        if (oversizedFiles.length > 0) {
            toast.error(`The following files exceed 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`)
            return
        }

        uploadTaskFiles.mutate(uploadFiles, {
            onSuccess: () => {
                toast.success(`${uploadFiles.length} file(s) uploaded successfully`)
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to upload files')
            }
        })
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (selectedFiles.length > 0) {
            handleFileUpload(selectedFiles)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

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
        if (droppedFiles.length > 0) {
            handleFileUpload(droppedFiles)
        }
    }

    const handleDownloadFile = (file: FileItem) => {
        if (file.fileURL) {
            window.open(file.fileURL, '_blank')
        }
    }

    const handleDeleteFile = async (fileId: string) => {
        toast.info('File deletion not implemented yet')
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                    <TbPaperclip className="h-5 w-5 mr-2" />
                    Attachments ({files.length})
                </h3>
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadTaskFiles.isPending}
                    size="sm"
                    variant="outline"
                >
                    <TbUpload className="h-4 w-4 mr-2" />
                    {uploadTaskFiles.isPending ? 'Uploading...' : 'Upload Files'}
                </Button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                accept="*/*"
            />

            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    isDragOver ? "border-primary bg-primary/5" : "border-border",
                    uploadTaskFiles.isPending && "opacity-50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <TbUpload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                    Drop files here or{' '}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary hover:underline"
                        disabled={uploadTaskFiles.isPending}
                    >
                        browse
                    </button>
                </p>
                <p className="text-xs text-muted-foreground">
                    Maximum file size: 10MB each
                </p>
            </div>

            {files.length > 0 && (
                <div className="gap-2 grid md:grid-cols-2">
                    {files.map((file) => (
                        <div
                            key={file._id}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                            {/* <div className="flex-shrink-0 bg-card rounded-md h-10 w-10">
                               
                            </div> */}
                            <FileThumbnailRenderer
                                fileType={file.name}
                                mimeType={file.mimeType}
                                size={file.size}
                            />
                            
                            <div className="flex-grow min-w-0 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium truncate pr-2">
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
                                                onClick={() => handleDeleteFile(file._id)}
                                                className="flex items-center gap-2 text-destructive"
                                            >
                                                <TbTrash className="h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {files.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <TbPaperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No attachments yet</p>
                    <p className="text-xs">Upload files to get started</p>
                </div>
            )}
        </div>
    )
}
