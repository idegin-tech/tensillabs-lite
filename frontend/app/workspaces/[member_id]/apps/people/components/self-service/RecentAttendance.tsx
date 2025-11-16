import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbClock2, TbArrowRight } from 'react-icons/tb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import React from 'react';
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder';
import Link from 'next/link';
import useCommon from '@/hooks/use-common';

export default function RecentAttendance({
  attendanceHistory,
  getStatusBadge,
}: {
  attendanceHistory: any[];
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  const { getPathToApp } = useCommon();

  return (
    <>
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TbClock2 className="h-5 w-5 text-blue-600" />
              </div>
              Recent Attendance
            </CardTitle>
            {attendanceHistory.length > 0 && (
              <Link href={`${getPathToApp('people')}/attendance`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  Show All
                  <TbArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {attendanceHistory.length === 0 ? (
            <SectionPlaceholder
              icon={TbClock2}
              heading="No Attendance Records"
              subHeading="Your attendance history will appear here once you start clocking in and out."
              variant="empty"
              fullWidth
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Clock In</TableHead>
                  <TableHead className="font-semibold">Clock Out</TableHead>
                  <TableHead className="font-semibold">Total Hours</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceHistory.map((record, index) => (
                  <TableRow key={index} className="border-b hover:bg-muted/50">
                    <TableCell className="font-medium py-4">
                      {format(new Date(record.clockIn), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="py-4">{format(new Date(record.clockIn), 'h:mm a')}</TableCell>
                    <TableCell className="py-4">{record.clockOut ? format(new Date(record.clockOut), 'h:mm a') : '-'}</TableCell>
                    <TableCell className="py-4 font-medium">
                      {record.totalHours ? `${record.totalHours.toFixed(2)}h` : '-'}
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(record.status)}
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
