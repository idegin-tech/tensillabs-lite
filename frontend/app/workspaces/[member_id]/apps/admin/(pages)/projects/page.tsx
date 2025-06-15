'use client'

import React, { useState, useMemo, useEffect } from 'react'
import AppBody from '@/components/layout/app-layout/AppBody'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import TablePlaceholder from '@/components/placeholders/TablePlaceholder'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    TbFolderOpen,
    TbSearch,
    TbPlus,
    TbDotsVertical,
    TbEye,
    TbEdit,
    TbTrash,
    TbRefresh,
    TbChevronLeft,
    TbChevronRight,
    TbX,
    TbLoader2
} from 'react-icons/tb'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Project } from '@/types/projects.types'
import { useProjects, useCreateProject, useUpdateProject } from '@/hooks/use-projects'
import { toast } from 'sonner'

interface ProjectsTableProps {
    projects: Project[]
    isLoading: boolean
    onViewProject: (project: Project) => void
    onEditProject: (project: Project) => void
    onDeleteProject: (project: Project) => void
}

function ProjectsTable({ projects, isLoading, onViewProject, onEditProject, onDeleteProject }: ProjectsTableProps) {
    if (isLoading) {
        return <TablePlaceholder rows={10} columns={5} />
    }    const getStatusBadge = (isActive: boolean) => {
        if (isActive) {
            return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
        }
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
    }

    const getClientName = (client: any) => {
        if (!client) return 'No Client'
        if (typeof client === 'string') return client
        return client?.name || 'Unknown Client'
    }

    const getCreatorName = (createdBy: any) => {
        if (typeof createdBy === 'string') return createdBy
        return `${createdBy?.firstName || ''} ${createdBy?.lastName || ''}`.trim() || 'Unknown'
    }

    const getCreatorInitials = (createdBy: any) => {
        if (typeof createdBy === 'string') return 'UN'
        const firstName = createdBy?.firstName || ''
        const lastName = createdBy?.lastName || ''
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'UN'
    }

    return (
        <div className="rounded-lg border bg-background shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-b">
                        <TableHead className="font-semibold text-foreground">Project</TableHead>
                        <TableHead className="font-semibold text-foreground">Client</TableHead>
                        <TableHead className="font-semibold text-foreground">Created By</TableHead>
                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                        <TableHead className="font-semibold text-foreground">Date Created</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project._id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="py-4">
                                <div className="space-y-1">
                                    <div className="font-semibold text-sm text-foreground">
                                        {project.name}
                                    </div>
                                    {project.description && (
                                        <div className="text-xs text-muted-foreground line-clamp-2">
                                            {project.description}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-muted-foreground font-medium">
                                {getClientName(project.client)}
                            </TableCell>
                            <TableCell className="py-4">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-7 w-7 ring-2 ring-background">
                                        <AvatarImage 
                                            src={typeof project.createdBy === 'object' ? project.createdBy.avatarURL?.sm : ''} 
                                            alt={getCreatorName(project.createdBy)} 
                                        />
                                        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                                            {getCreatorInitials(project.createdBy)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm text-muted-foreground">
                                        {getCreatorName(project.createdBy)}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="py-4">
                                {getStatusBadge(project.isActive)}
                            </TableCell>
                            <TableCell className="py-4 text-muted-foreground font-medium">
                                {format(new Date(project.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="py-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                            <TbDotsVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem onClick={() => onViewProject(project)}>
                                            <TbEye className="h-4 w-4 mr-2" />
                                            View Project
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEditProject(project)}>
                                            <TbEdit className="h-4 w-4 mr-2" />
                                            Edit Project
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDeleteProject(project)}
                                            className="text-destructive"
                                        >
                                            <TbTrash className="h-4 w-4 mr-2" />
                                            Delete Project
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onItemsPerPageChange: (itemsPerPage: number) => void
}

function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-background border-t">
            <div className="flex items-center space-x-6 lg:space-x-8 justify-between w-full ">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-muted-foreground">Rows per page</p>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => onItemsPerPageChange(Number(value))}
                    >
                        <SelectTrigger className="h-9 w-[75px] border-muted">
                            <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[120px] items-center justify-center text-sm font-medium text-muted-foreground">
                    {totalItems > 0 ? `${startItem}-${endItem} of ${totalItems}` : '0 of 0'}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 border-muted hover:bg-muted"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <TbChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 border-muted hover:bg-muted"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        <TbChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface ProjectDialogProps {
    project?: Project
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => void
    isLoading: boolean
}

function ProjectDialog({ project, open, onOpenChange, onSubmit, isLoading }: ProjectDialogProps) {    
    const [formData, setFormData] = useState({
        name: project?.name || '',
        description: project?.description || '',
        client: typeof project?.client === 'string' ? project.client : project?.client?._id || ''
    })

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description || '',
                client: typeof project.client === 'string' ? project.client : project.client?._id || ''
            })
        } else {
            setFormData({
                name: '',
                description: '',
                client: ''
            })
        }
    }, [project, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error('Please enter a project name')
            return
        }        
        const submitData: any = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            client: formData.client.trim() || undefined
        }
        
        Object.keys(submitData).forEach(key => {
            if (submitData[key] === undefined) {
                delete submitData[key]
            }
        })
        
        onSubmit(submitData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {project ? 'Edit Project' : 'Create New Project'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter project name"
                            required
                        />
                    </div>                    <div className="space-y-2">
                        <Label htmlFor="client">Client ID</Label>
                        <Input
                            id="client"
                            value={formData.client}
                            onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                            placeholder="Enter client ID (optional)"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter project description"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {project ? 'Update' : 'Create'} Project
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    const createProject = useCreateProject()
    const updateProject = useUpdateProject()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearchQuery])

    const { projects, pagination, isLoading, error, refetch } = useProjects({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchQuery,
    })

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1)
    }

    const handleRefresh = () => {
        refetch()
    }

    const handleClearFilters = () => {
        setSearchQuery('')
        setCurrentPage(1)
    }

    const handleCreateProject = () => {
        setEditingProject(null)
        setIsDialogOpen(true)
    }

    const handleEditProject = (project: Project) => {
        setEditingProject(project)
        setIsDialogOpen(true)
    }

    const handleSubmitProject = async (formData: any) => {
        try {
            if (editingProject) {
                await updateProject.mutateAsync({
                    id: editingProject._id,
                    data: formData
                })
                toast.success('Project updated successfully')
            } else {
                await createProject.mutateAsync(formData)
                toast.success('Project created successfully')
            }
            setIsDialogOpen(false)
            setEditingProject(null)
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        }
    }

    const hasActiveFilters = debouncedSearchQuery

    const renderFilters = () => (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/20 rounded-lg border">
            <div className="relative flex-1 max-w-sm">
                <TbSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 border-muted focus:border-primary"
                    disabled={isLoading}
                />
            </div>
            <div className="flex items-center gap-3">
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleClearFilters} className="h-10 border-muted">
                        <TbX className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    )

    const renderContent = () => {
        if (error) {
            return (
                <SectionPlaceholder
                    variant="error"
                    icon={TbFolderOpen}
                    heading="Failed to load projects"
                    subHeading="We couldn't load the projects. Please check your connection and try again."
                    ctaButton={{
                        label: "Try Again",
                        onClick: handleRefresh,
                        icon: TbRefresh
                    }}
                />
            )
        }

        if (isLoading && projects.length === 0) {
            return <TablePlaceholder rows={10} columns={5} />
        }

        if (!isLoading && projects.length === 0 && !hasActiveFilters) {
            return (
                <SectionPlaceholder
                    variant="empty"
                    icon={TbFolderOpen}
                    heading="No projects found"
                    subHeading="Get started by creating your first project for this workspace."
                    ctaButton={{
                        label: "Create Project",
                        onClick: handleCreateProject,
                        icon: TbPlus
                    }}
                />
            )
        }

        if (!isLoading && projects.length === 0 && hasActiveFilters) {
            return (
                <SectionPlaceholder
                    variant="empty"
                    icon={TbFolderOpen}
                    heading="No projects match your search"
                    subHeading="Try adjusting your search criteria or clearing the filters."
                    ctaButton={{
                        label: "Clear Filters",
                        onClick: handleClearFilters,
                        icon: TbX
                    }}
                />
            )
        }

        return (
            <div className="space-y-4">
                <ProjectsTable
                    projects={projects}
                    isLoading={isLoading}
                    onViewProject={() => {}}
                    onEditProject={handleEditProject}
                    onDeleteProject={() => {}}
                />
                <Pagination
                    currentPage={pagination?.currentPage || 1}
                    totalPages={pagination?.totalPages || 1}
                    totalItems={pagination?.totalItems || 0}
                    itemsPerPage={pagination?.itemsPerPage || itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </div>
        )
    }

    return (
        <AppBody>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
                        <p className="text-base text-muted-foreground">
                            Manage workspace projects and assignments
                            {pagination?.totalItems ? ` • ${pagination.totalItems} ${pagination.totalItems === 1 ? 'project' : 'projects'}` : ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="h-10 border-muted hover:bg-muted"
                        >
                            <TbRefresh className={cn("h-4 w-4", isLoading && "animate-spin")} />
                            Refresh
                        </Button>
                        <Button
                            onClick={handleCreateProject}
                            className="h-10 flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <TbPlus className="h-4 w-4" />
                            Create Project
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    {renderFilters()}
                    {renderContent()}
                </div>
            </div>            <ProjectDialog
                project={editingProject || undefined}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmitProject}
                isLoading={createProject.isPending || updateProject.isPending}
            />
        </AppBody>
    )
}
