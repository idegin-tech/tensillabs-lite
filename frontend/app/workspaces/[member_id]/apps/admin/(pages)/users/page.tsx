"use client"

import { useState, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, ChevronLeft, ChevronRight, Users, Filter } from "lucide-react"
import AppBody from "@/components/layout/app-layout/AppBody"
import { TbUser } from "react-icons/tb"


const mockUsers = [
  {
    id: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Alice Johnson",
    email: "alice.johnson@company.com",
    role: "Admin",
    dateJoined: "2023-01-15",
    status: "active",
  },
  {
    id: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Bob Smith",
    email: "bob.smith@company.com",
    role: "Manager",
    dateJoined: "2023-02-20",
    status: "active",
  },
  {
    id: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Carol Davis",
    email: "carol.davis@company.com",
    role: "Developer",
    dateJoined: "2023-03-10",
    status: "pending",
  },
  {
    id: 4,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "David Wilson",
    email: "david.wilson@company.com",
    role: "Designer",
    dateJoined: "2023-01-05",
    status: "suspended",
  },
  {
    id: 5,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Emma Brown",
    email: "emma.brown@company.com",
    role: "Developer",
    dateJoined: "2023-04-12",
    status: "active",
  },
  {
    id: 6,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Frank Miller",
    email: "frank.miller@company.com",
    role: "Manager",
    dateJoined: "2023-02-28",
    status: "active",
  },
  {
    id: 7,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Grace Lee",
    email: "grace.lee@company.com",
    role: "Analyst",
    dateJoined: "2023-05-18",
    status: "pending",
  },
  {
    id: 8,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Henry Taylor",
    email: "henry.taylor@company.com",
    role: "Developer",
    dateJoined: "2023-03-22",
    status: "active",
  },
  {
    id: 9,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Ivy Chen",
    email: "ivy.chen@company.com",
    role: "Designer",
    dateJoined: "2023-06-01",
    status: "suspended",
  },
  {
    id: 10,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Jack Robinson",
    email: "jack.robinson@company.com",
    role: "Admin",
    dateJoined: "2023-01-30",
    status: "active",
  },
  {
    id: 11,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Kate Anderson",
    email: "kate.anderson@company.com",
    role: "Manager",
    dateJoined: "2023-04-05",
    status: "active",
  },
  {
    id: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "Liam Garcia",
    email: "liam.garcia@company.com",
    role: "Developer",
    dateJoined: "2023-05-10",
    status: "pending",
  },
]

type User = (typeof mockUsers)[0]
type StatusFilter = "all" | "active" | "pending" | "suspended"

export default function UsersListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      suspended: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <AppBody>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground">Manage your team members and their account permissions here.</p>
            </div>
            <div className="flex items-center gap-2">
               <Button variant={'outline'}><TbUser /> Invite User</Button>
            </div>
          </div>

          <div>
            <div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">User</TableHead>
                      <TableHead className="hidden md:table-cell">Role</TableHead>
                      <TableHead className="hidden lg:table-cell">Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Date Joined</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No users found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                                <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">{user.fullName}</p>
                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                <div className="md:hidden mt-1 flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">{user.role}</span>
                                  {getStatusBadge(user.status)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="font-medium">{user.role}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {formatDate(user.dateJoined)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div>
              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppBody>
    </>
  )
}
