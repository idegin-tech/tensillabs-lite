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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
    TbLoader2,
    TbBuilding
} from 'react-icons/tb'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Project } from '@/types/projects.types'
import { useProjects, useCreateProject, useUpdateProject, useToggleProjectActive, useDeleteProject } from '@/hooks/use-projects'
import { toast } from 'sonner'
import ProjectDialog from './ProjectDialog'

interface ProjectsTableProps {
    projects: Project[]
    isLoading: boolean
    onEditProject: (project: Project) => void
    onToggleActive: (project: Project) => void
    onDeleteProject: (project: Project) => void
}

function ProjectsTable({ projects, isLoading, onEditProject, onToggleActive, onDeleteProject }: ProjectsTableProps) {
    if (isLoading) {
        return <TablePlaceholder rows={10} columns={5} />
    }

    const getStatusBadge = (isActive: boolean) => {
        if (isActive) {
            return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
        }
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
    }

    const getClientDisplay = (client: any) => {
        if (!client) {
            return (
                <span className="text-muted-foreground">No Client</span>
            )
        }

        const clientName = typeof client === 'string' ? client : client?.name || 'Unknown Client'

        return (
            <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <TbBuilding className="h-3 w-3 text-primary" />
                    </div>
                </div>
                <span className="text-sm font-medium">{clientName}</span>
            </div>
        )
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
                        <TableHead className="font-semibold text-foreground w-96 min-w-96">Project</TableHead>
                        <TableHead className="font-semibold text-foreground">Client</TableHead>
                        <TableHead className="font-semibold text-foreground">Created By</TableHead>
                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                        <TableHead className="font-semibold text-foreground">Date Created</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (<TableRow key={project._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="py-4 w-96 min-w-96">
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
                        <TableCell className="py-4">
                            {getClientDisplay(project.client)}
                        </TableCell>
                        <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-7 w-7 ring-2 ring-background">                                    <AvatarImage
                                        src={typeof project.createdBy === 'object' ? project.createdBy.avatarURL?.sm || undefined : undefined}
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
                                    <DropdownMenuItem onClick={() => onEditProject(project)}>
                                        <TbEdit className="h-4 w-4 mr-2" />
                                        Edit Project
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onToggleActive(project)}>
                                        <TbEye className="h-4 w-4 mr-2" />
                                        {project.isActive ? 'Make Inactive' : 'Make Active'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        variant='destructive'
                                        onClick={() => onDeleteProject(project)}
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

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

    const createProject = useCreateProject()
    const updateProject = useUpdateProject()
    const toggleProjectActive = useToggleProjectActive()
    const deleteProject = useDeleteProject(); useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearchQuery, statusFilter])

    const { projects, pagination, isLoading, error, refetch } = useProjects({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchQuery,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active' ? 'true' : 'false',
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

    const handleToggleActive = async (project: Project) => {
        try {
            await toggleProjectActive.mutateAsync({
                id: project._id,
                isActive: !project.isActive
            })
            toast.success(`Project ${!project.isActive ? 'activated' : 'deactivated'} successfully`)
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        }
    }

    const handleDeleteProject = (project: Project) => {
        setProjectToDelete(project)
        setIsDeleteDialogOpen(true)
    }

    const confirmDeleteProject = async () => {
        if (!projectToDelete) return

        try {
            await deleteProject.mutateAsync(projectToDelete._id)
            toast.success('Project deleted successfully')
            setIsDeleteDialogOpen(false)
            setProjectToDelete(null)
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        }
    }

    const cancelDeleteProject = () => {
        setIsDeleteDialogOpen(false)
        setProjectToDelete(null)
    }; const hasActiveFilters = debouncedSearchQuery || statusFilter !== 'all'

    const handleClearFilters = () => {
        setSearchQuery('')
        setStatusFilter('all')
        setCurrentPage(1)
    }

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
            </div>            <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="status-filter" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        Status:
                    </Label>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-10 w-[140px] border-muted focus:border-primary">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                                    All Projects
                                </div>
                            </SelectItem>
                            <SelectItem value="active">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                    Active Only
                                </div>
                            </SelectItem>
                            <SelectItem value="inactive">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                                    Inactive Only
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-10 border-muted">
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
                    onEditProject={handleEditProject}
                    onToggleActive={handleToggleActive}
                    onDeleteProject={handleDeleteProject}
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
            </div>
            <ProjectDialog
                project={editingProject || undefined}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmitProject}
                isLoading={createProject.isPending || updateProject.isPending}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{projectToDelete?.name}"? This project may be in use in other parts of the system and deleting it may cause issues. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDeleteProject}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteProject}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteProject.isPending}
                        >
                            {deleteProject.isPending && <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Project
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppBody>
    )
}
