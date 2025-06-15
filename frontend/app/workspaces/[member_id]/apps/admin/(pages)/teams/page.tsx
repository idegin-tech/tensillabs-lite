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
    TbUsers,
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
import { Team } from '@/types/teams.types'
import { useTeams, useCreateTeam, useUpdateTeam } from '@/hooks/use-teams'
import { toast } from 'sonner'

interface TeamsTableProps {
    teams: Team[]
    isLoading: boolean
    onViewTeam: (team: Team) => void
    onEditTeam: (team: Team) => void
    onDeleteTeam: (team: Team) => void
}

function TeamsTable({ teams, isLoading, onViewTeam, onEditTeam, onDeleteTeam }: TeamsTableProps) {
    if (isLoading) {
        return <TablePlaceholder />
    }

    return (
        <div className="rounded-lg border bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-muted">
                        <TableHead className="font-medium text-muted-foreground">Name</TableHead>
                        <TableHead className="font-medium text-muted-foreground">Description</TableHead>
                        <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                        <TableHead className="font-medium text-muted-foreground">Created By</TableHead>
                        <TableHead className="font-medium text-muted-foreground">Created</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teams.map((team) => (
                        <TableRow key={team._id} className="hover:bg-muted/30 border-muted/50">
                            <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {team.name}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm text-muted-foreground truncate max-w-xs">
                                    {team.description || 'No description'}
                                </p>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={team.isActive ? "default" : "secondary"}
                                    className={cn(
                                        "text-xs font-medium px-2 py-1",
                                        team.isActive
                                            ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                                    )}
                                >
                                    {team.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    {typeof team.createdBy === 'object' && team.createdBy ? (
                                        <>
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage 
                                                    src={team.createdBy.avatarURL?.sm} 
                                                    alt={`${team.createdBy.firstName} ${team.createdBy.lastName}`} 
                                                />
                                                <AvatarFallback className="text-xs bg-muted">
                                                    {team.createdBy.firstName?.charAt(0)}{team.createdBy.lastName?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {team.createdBy.firstName} {team.createdBy.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {team.createdBy.primaryEmail}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Unknown</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">
                                        {format(new Date(team.createdAt), 'MMM d, yyyy')}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(team.createdAt), 'h:mm a')}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-muted"
                                        >
                                            <TbDotsVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem
                                            onClick={() => onViewTeam(team)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                                        >
                                            <TbEye className="h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onEditTeam(team)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                                        >
                                            <TbEdit className="h-4 w-4" />
                                            Edit Team
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDeleteTeam(team)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <TbTrash className="h-4 w-4" />
                                            Delete Team
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

interface TeamDialogProps {
    team?: Team | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => void
    isLoading: boolean
}

function TeamDialog({ team, open, onOpenChange, onSubmit, isLoading }: TeamDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })

    useEffect(() => {
        if (team) {
            setFormData({
                name: team.name || '',
                description: team.description || ''
            })
        } else {
            setFormData({
                name: '',
                description: ''
            })
        }
    }, [team, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {team ? 'Edit Team' : 'Create New Team'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter team name..."
                                required
                                className="border-muted focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter team description..."
                                rows={3}
                                className="border-muted focus:border-primary resize-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="border-muted hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.name.trim()}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isLoading && <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {team ? 'Update Team' : 'Create Team'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function TeamsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingTeam, setEditingTeam] = useState<Team | null>(null)

    const createTeam = useCreateTeam()
    const updateTeam = useUpdateTeam()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearchQuery])

    const { teams, pagination, isLoading, error, refetch } = useTeams({
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

    const handleCreateTeam = () => {
        setEditingTeam(null)
        setIsDialogOpen(true)
    }

    const handleEditTeam = (team: Team) => {
        setEditingTeam(team)
        setIsDialogOpen(true)
    }

    const handleSubmitTeam = async (formData: any) => {
        try {
            if (editingTeam) {
                await updateTeam.mutateAsync({
                    id: editingTeam._id,
                    data: formData
                })
                toast.success('Team updated successfully')
            } else {
                await createTeam.mutateAsync(formData)
                toast.success('Team created successfully')
            }
            setIsDialogOpen(false)
            setEditingTeam(null)
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
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 border-muted focus:border-primary"
                    disabled={isLoading}
                />
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="h-10 border-muted hover:bg-muted"
                >
                    <TbRefresh className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-10 border-muted hover:bg-muted"
                    >
                        <TbX className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
                <Button
                    onClick={handleCreateTeam}
                    disabled={isLoading}
                    className="h-10 bg-primary hover:bg-primary/90"
                >
                    <TbPlus className="h-4 w-4 mr-2" />
                    Create Team
                </Button>
            </div>
        </div>
    )

    const renderContent = () => {
        // Loading state
        if (isLoading && teams.length === 0) {
            return (
                <div className="space-y-4">
                    <div className="h-16 bg-muted/20 rounded-lg animate-pulse" />
                    <TablePlaceholder />
                </div>
            )
        }

        // Error state
        if (error) {
            return (
                <SectionPlaceholder
                    variant="error"
                    icon={TbUsers}
                    heading="Failed to load teams"
                    subHeading="There was an error loading the teams. Please try again."
                    ctaButton={{
                        label: "Try Again",
                        onClick: handleRefresh,
                        icon: TbRefresh
                    }}
                />
            )
        }

        // Empty state without filters
        if (!isLoading && teams.length === 0 && !hasActiveFilters) {
            return (
                <SectionPlaceholder
                    variant="empty"
                    icon={TbUsers}
                    heading="No teams found"
                    subHeading="Get started by creating your first team for this workspace."
                    ctaButton={{
                        label: "Create Team",
                        onClick: handleCreateTeam,
                        icon: TbPlus
                    }}
                />
            )
        }

        // Empty state with filters
        if (!isLoading && teams.length === 0 && hasActiveFilters) {
            return (
                <SectionPlaceholder
                    variant="empty"
                    icon={TbUsers}
                    heading="No teams match your search"
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
                <TeamsTable
                    teams={teams}
                    isLoading={isLoading}
                    onViewTeam={() => { }}
                    onEditTeam={handleEditTeam}
                    onDeleteTeam={() => { }}
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
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Teams</h1>
                        <p className="text-muted-foreground">
                            Manage your workspace teams and their details.
                        </p>
                    </div>
                </div>

                {renderFilters()}
                {renderContent()}
            </div>

            <TeamDialog
                team={editingTeam}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmitTeam}
                isLoading={createTeam.isPending || updateTeam.isPending}
            />
        </AppBody>
    )
}
