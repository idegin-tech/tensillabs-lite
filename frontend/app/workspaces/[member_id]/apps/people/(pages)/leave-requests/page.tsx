'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { TbBeach, TbCalendar, TbPlus, TbX, TbDots } from 'react-icons/tb';
import { useApiQuery, useInvalidateQueries } from '@/hooks/use-api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TablePlaceholder from '@/components/placeholders/TablePlaceholder';
import SectionError from '@/components/SectionError';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../types/hrms.types';
import CreateLeaveRequestDialog from '../../components/CreateLeaveRequestDialog';

interface LeaveRequestsResponse {
  leaveRequests: LeaveRequest[];
  total: number;
  page: number;
  limit: number;
}

export default function MyLeaveRequestsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.member_id as string;
  const { invalidate } = useInvalidateQueries();
  
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [status, setStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (status !== 'all') queryParams.append('status', status);

  const { data: response, isLoading: loading, error } = useApiQuery<LeaveRequestsResponse>(
    ['my-leave-requests', workspaceId, page.toString(), limit.toString(), status],
    `/hrms/leave-requests/me?${queryParams.toString()}`
  );

  const handleWithdraw = async (id: string) => {
    try {
      await api.patch(`/hrms/leave-requests/${id}/withdraw`, {}, {
        headers: { 'X-Member-ID': workspaceId }
      });
      toast.success('Leave request withdrawn successfully');
      invalidate(['my-leave-requests', workspaceId]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to withdraw leave request');
    }
  };

  const handleClearFilters = () => {
    setStatus('all');
    setPage(1);
  };

  const hasFilters = status !== 'all';

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Leave Requests</h1>
              <p className="text-sm text-muted-foreground">View and manage your leave requests</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <TbPlus className="mr-2 h-4 w-4" />
              New Leave Request
            </Button>
          </div>
        </div>
        <div className="flex-1 p-6">
          <TablePlaceholder rows={10} columns={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Leave Requests</h1>
              <p className="text-sm text-muted-foreground">View and manage your leave requests</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <TbPlus className="mr-2 h-4 w-4" />
              New Leave Request
            </Button>
          </div>
        </div>
        <div className="flex-1 p-6">
          <SectionError message="Failed to load leave requests" />
        </div>
      </div>
    );
  }

  const leaveRequests = response?.leaveRequests || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const getStatusBadgeColor = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case LeaveStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case LeaveStatus.WITHDRAWN:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <>
      <CreateLeaveRequestDialog
        isOpen={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
          invalidate(['my-leave-requests', workspaceId]);
        }}
      />
      <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">My Leave Requests</h1>
            <p className="text-sm text-muted-foreground">View and manage your leave requests</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <TbPlus className="mr-2 h-4 w-4" />
            New Leave Request
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64">
            <label className="text-sm font-medium mb-1.5 block">Status</label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <div className="flex items-end">
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                title="Clear filters"
              >
                <TbX className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {leaveRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <TbBeach className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No leave requests</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {hasFilters
                ? 'No leave requests found with the current filters.'
                : 'You have not submitted any leave requests yet.'}
            </p>
            <Button variant={'outline'} size='sm'>
              <TbPlus className="mr-2 h-4 w-4" />
              Create Your First Leave Request
            </Button>
          </div>
        ) : (
          <div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {getLeaveTypeLabel(request.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TbCalendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(request.startDate), 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TbCalendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(request.endDate), 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.reason || '-'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <TbDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/workspaces/${workspaceId}/apps/people/leave-requests/${request.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            {request.status === LeaveStatus.PENDING && (
                              <>
                                <DropdownMenuItem onClick={() => router.push(`/workspaces/${workspaceId}/apps/people/leave-requests/${request.id}/edit`)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleWithdraw(request.id)}
                                >
                                  Withdraw
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} requests
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
