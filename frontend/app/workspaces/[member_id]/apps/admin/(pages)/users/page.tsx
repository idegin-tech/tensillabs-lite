'use client'

import React, { useState, useMemo, useEffect } from 'react'
import AppBody from '@/components/layout/app-layout/AppBody'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import TablePlaceholder from '@/components/placeholders/TablePlaceholder'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
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
    TbUsers,
    TbSearch,
    TbFilter,
    TbPlus,
    TbDotsVertical,
    TbEye,
    TbEdit,
    TbUserMinus,
    TbTrash,
    TbRefresh,
    TbChevronLeft,
    TbChevronRight,
    TbX
} from 'react-icons/tb'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { WorkspaceMember } from '@/types/workspace.types'
import { useWorkspaceMembers } from '@/hooks/use-workspace-members'

interface UsersTableProps {
    users: WorkspaceMember[]
    isLoading: boolean
    onViewUser: (user: WorkspaceMember) => void
    onEditUser: (user: WorkspaceMember) => void
    onSuspendUser: (user: WorkspaceMember) => void
    onDeleteUser: (user: WorkspaceMember) => void
}

function UsersTable({ users, isLoading, onViewUser, onEditUser, onSuspendUser, onDeleteUser }: UsersTableProps) {
    if (isLoading) {
        return <TablePlaceholder rows={10} columns={6} />
    } const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
            case 'suspended':
                return <Badge className="bg-red-100 text-destructive hover:bg-red-100">Suspended</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getPermissionBadge = (permission: string) => {
        switch (permission) {
            case 'super_admin':
                return <Badge variant="default">Super Admin</Badge>
            case 'admin':
                return <Badge variant="default">Admin</Badge>
            case 'manager':
                return <Badge variant="secondary">Manager</Badge>
            case 'regular':
                return <Badge variant="outline">Regular</Badge>
            default:
                return <Badge variant="outline">{permission}</Badge>
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    return (
        <div className="rounded-lg border bg-background shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-b">
                        <TableHead className="font-semibold text-foreground">User</TableHead>
                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                        <TableHead className="font-semibold text-foreground">Permission</TableHead>
                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                        <TableHead className="font-semibold text-foreground">Date Added</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="py-4">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-9 w-9 ring-2 ring-background">
                                        <AvatarImage src={user.avatarURL.sm} alt={`${user.firstName} ${user.lastName}`} />
                                        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                                            {getInitials(user.firstName, user.lastName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-sm text-foreground">
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-muted-foreground font-medium">
                                {user.primaryEmail}
                            </TableCell>
                            <TableCell className="py-4">
                                {getPermissionBadge(user.permission)}
                            </TableCell>
                            <TableCell className="py-4">
                                {getStatusBadge(user.status)}
                            </TableCell>
                            <TableCell className="py-4 text-muted-foreground font-medium">
                                {format(new Date(user.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="py-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                            <TbDotsVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem onClick={() => onViewUser(user)}>
                                            <TbEye className="h-4 w-4 mr-2" />
                                            View User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                                            <TbEdit className="h-4 w-4 mr-2" />
                                            Edit User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onSuspendUser(user)}
                                            className="text-orange-600"
                                        >
                                            <TbUserMinus className="h-4 w-4 mr-2" />
                                            {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'} User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDeleteUser(user)}
                                            className="text-destructive"
                                        >
                                            <TbTrash className="h-4 w-4 mr-2" />
                                            Delete User
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

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [permissionFilter, setPermissionFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearchQuery, statusFilter, permissionFilter])

    const { members, pagination, isLoading, error, refetch } = useWorkspaceMembers({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter,
        permission: permissionFilter === 'all' ? undefined : permissionFilter,
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
        setStatusFilter('all')
        setPermissionFilter('all')
        setCurrentPage(1)
    }

    const hasActiveFilters = debouncedSearchQuery || statusFilter !== 'all' || permissionFilter !== 'all'

    const renderFilters = () => (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/20 rounded-lg border">
            <div className="relative flex-1 max-w-sm">
                <TbSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    debounceMs={400}
                    onDebouncedChange={(e) => setSearchQuery(e)}
                    className="pl-9 h-10 border-muted focus:border-primary"
                    disabled={isLoading}
                />
            </div>
            <div className="flex items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
                    <SelectTrigger className="w-36 h-10 border-muted">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={permissionFilter} onValueChange={setPermissionFilter} disabled={isLoading}>
                    <SelectTrigger className="w-40 h-10 border-muted">
                        <SelectValue placeholder="Permission" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Permissions</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                    </SelectContent>
                </Select>
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
                    icon={TbUsers}
                    heading="Failed to load users"
                    subHeading="We couldn't load the workspace members. Please check your connection and try again."
                    ctaButton={{
                        label: "Try Again",
                        onClick: handleRefresh,
                        icon: TbRefresh
                    }}
                />
            )
        }

        if (isLoading && members.length === 0) {
            return <TablePlaceholder rows={10} columns={6} />
        }

        if (!isLoading && members.length === 0 && !hasActiveFilters) {
            return (
                <SectionPlaceholder
                    variant="empty"
                    icon={TbUsers}
                    heading="No users found"
                    subHeading="Get started by inviting your first team member to join this workspace."
                    ctaButton={{
                        label: "Invite User",
                        onClick: () => { },
                        icon: TbPlus
                    }}
                />
            )
        }

        if (!isLoading && members.length === 0 && hasActiveFilters) {
            return (
                <SectionPlaceholder
                    variant="empty"
                    icon={TbUsers}
                    heading="No users match your filters"
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
                <UsersTable
                    users={members}
                    isLoading={isLoading}
                    onViewUser={() => { }}
                    onEditUser={() => { }}
                    onSuspendUser={() => { }}
                    onDeleteUser={() => { }}
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
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
                        <p className="text-base text-muted-foreground">
                            Manage workspace members and their permissions
                            {pagination?.totalItems ? ` • ${pagination.totalItems} ${pagination.totalItems === 1 ? 'member' : 'members'}` : ''}
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
                            onClick={() => { }}
                            className="h-10 flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <TbPlus className="h-4 w-4" />
                            Invite User
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    {renderFilters()}
                    {renderContent()}
                </div>
            </div>
        </AppBody>
    )
}
