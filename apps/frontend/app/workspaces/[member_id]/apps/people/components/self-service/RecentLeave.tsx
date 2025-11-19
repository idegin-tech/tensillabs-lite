import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbCalendarOff, TbArrowRight } from 'react-icons/tb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder';
import Link from 'next/link';
import useCommon from '@/hooks/use-common';

const leaveTypeLabels: Record<string, string> = {
  annual: 'Annual Leave',
  sick: 'Sick Leave',
  casual: 'Casual Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  unpaid: 'Unpaid Leave',
  other: 'Other'
}

export default function RecentLeave({
  leaveRequests,
  getStatusBadge,
}: {
  leaveRequests: any[];
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  const { getPathToApp } = useCommon();

  return (
    <>
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TbCalendarOff className="h-5 w-5 text-purple-600" />
              </div>
              Leave Request History
            </CardTitle>
            {leaveRequests.length > 0 && (
              <Link href={`${getPathToApp('people')}/leave-requests`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  Show All
                  <TbArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <SectionPlaceholder
              icon={TbCalendarOff}
              heading="No Leave Requests"
              subHeading="Your leave request history will appear here once you submit leave requests."
              variant="empty"
              fullWidth
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Dates</TableHead>
                  <TableHead className="font-semibold">Days</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <TableCell className="font-medium py-4">
                      {leaveTypeLabels[request.type] || request.type}
                    </TableCell>
                    <TableCell className="py-4">{request.startDate} - {request.endDate}</TableCell>
                    <TableCell className="py-4">
                      {request.totalDays} day{request.totalDays > 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="py-4 max-w-xs">
                      <div className="truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
