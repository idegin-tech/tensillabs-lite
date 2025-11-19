'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { TbSearch, TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import FileCard from '@/components/FileCard'
import { useListFiles } from '@/hooks/use-list'
import ListFilesLoading from './ListFilesLoading'
import { toast } from 'sonner'

export default function ListFilesTab() {
    const params = useParams()
    const listId = params.list_id as string

    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [sortBy, setSortBy] = useState<'uploadedAt' | 'size' | 'filename'>('uploadedAt')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [mimeType, setMimeType] = useState<'image' | 'video' | 'document' | 'other' | 'all'>('all')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search])

    const { data, isLoading, error } = useListFiles(listId, {
        page,
        limit: 20,
        search: debouncedSearch,
        sortBy,
        sortOrder,
        mimeType: mimeType === 'all' ? undefined : mimeType,
    })

    const handleDownload = useCallback((file: any) => {
        window.open(file.fileURL, '_blank')
    }, [])

    const handleView = useCallback((file: any) => {
        window.open(file.fileURL, '_blank')
    }, [])

    const handleEdit = useCallback((file: any) => {
        toast.info('Edit functionality coming soon')
    }, [])

    const handleDelete = useCallback((file: any) => {
        toast.info('Delete functionality coming soon')
    }, [])

    if (isLoading) {
        return <ListFilesLoading />
    }

    if (error) {
        return (
            <div className="p-4 flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                    <p className="text-destructive font-medium">Failed to load files</p>
                    <p className="text-sm text-muted-foreground">Please try again later</p>
                </div>
            </div>
        )
    }

    const files = data?.files || []
    const totalCount = data?.totalCount || 0
    const hasMore = data?.hasMore || false
    const totalPages = Math.ceil(totalCount / 20)

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="relative w-full md:max-w-md">
                    <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search files..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        className="pl-9"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Select
                        value={mimeType}
                        onValueChange={(value: any) => {
                            setMimeType(value)
                            setPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="File type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="image">Images</SelectItem>
                            <SelectItem value="video">Videos</SelectItem>
                            <SelectItem value="document">Documents</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={sortBy}
                        onValueChange={(value: any) => {
                            setSortBy(value)
                            setPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="uploadedAt">Upload Date</SelectItem>
                            <SelectItem value="size">File Size</SelectItem>
                            <SelectItem value="filename">File Name</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={sortOrder}
                        onValueChange={(value: any) => {
                            setSortOrder(value)
                            setPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Descending</SelectItem>
                            <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {files.length === 0 ? (
                <div className="flex items-center justify-center h-[400px]">
                    <div className="text-center space-y-2">
                        <p className="text-muted-foreground font-medium">No files found</p>
                        <p className="text-sm text-muted-foreground">
                            {search ? 'Try adjusting your search or filters' : 'Files will appear here when added to tasks'}
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {files.map((file) => (
                            <FileCard
                                key={file._id}
                                file={file}
                                size="small"
                                onDownload={handleDownload}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <TbChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>

                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1
                                    } else if (page <= 3) {
                                        pageNumber = i + 1
                                    } else if (page >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i
                                    } else {
                                        pageNumber = page - 2 + i
                                    }

                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={page === pageNumber ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setPage(pageNumber)}
                                            className="w-10"
                                        >
                                            {pageNumber}
                                        </Button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={!hasMore}
                            >
                                Next
                                <TbChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}

                    <p className="text-sm text-muted-foreground text-center">
                        Showing {files.length} of {totalCount} files
                    </p>
                </>
            )}
        </div>
    )
}
