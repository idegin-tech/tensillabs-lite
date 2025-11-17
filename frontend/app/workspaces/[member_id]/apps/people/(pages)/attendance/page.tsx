'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { format, subDays } from 'date-fns';
import { TbClock, TbCalendar, TbFilter, TbX } from 'react-icons/tb';
import { useApiQuery } from '@/hooks/use-api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import TablePlaceholder from '@/components/placeholders/TablePlaceholder';
import SectionError from '@/components/SectionError';
import { Attendance, AttendanceStatus } from '../../types/hrms.types';

interface AttendanceResponse {
  data: Attendance[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function MyAttendancePage() {
  const params = useParams();
  const workspaceId = params.member_id as string;
  
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 9));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState('all');

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (startDate) queryParams.append('startDate', format(startDate, 'yyyy-MM-dd'));
  if (endDate) queryParams.append('endDate', format(endDate, 'yyyy-MM-dd'));
  if (status !== 'all') queryParams.append('status', status);

  const { data: response, isLoading: loading, error } = useApiQuery<AttendanceResponse>(
    ['my-attendance', workspaceId, page.toString(), limit.toString(), startDate?.toISOString() || '', endDate?.toISOString() || '', status],
    `/hrms/attendance/my-attendance?${queryParams.toString()}`
  );

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus('all');
    setPage(1);
  };

  const hasFilters = startDate || endDate || status !== 'all';

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Attendance</h1>
              <p className="text-sm text-muted-foreground">View your attendance history</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <TablePlaceholder rows={10} columns={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">My Attendance</h1>
          <p className="text-sm text-muted-foreground">View your attendance history</p>
        </div>
        <div className="flex-1 p-6">
          <SectionError message="Failed to load attendance records" />
        </div>
      </div>
    );
  }

  const attendances = response?.data || [];
  const total = response?.total || 0;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">My Attendance</h1>
            <p className="text-sm text-muted-foreground">View your attendance history</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1.5 block">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <TbCalendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setPage(1);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1.5 block">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <TbCalendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setPage(1);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 min-w-[200px]">
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
                <SelectItem value={AttendanceStatus.OPEN}>Open</SelectItem>
                <SelectItem value={AttendanceStatus.CLOSED}>Closed</SelectItem>
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
        {attendances.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <TbClock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No attendance records</h3>
            <p className="text-sm text-muted-foreground">
              {hasFilters
                ? 'No attendance records found with the current filters.'
                : 'You have no attendance records yet.'}
            </p>
          </div>
        ) : (
          <div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TbCalendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(attendance.clockIn), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {attendance.clockOut ? (
                          <div className="flex items-center gap-2">
                            <TbCalendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(attendance.clockOut), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attendance.status === AttendanceStatus.CLOSED
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {attendance.status === AttendanceStatus.CLOSED ? 'Closed' : 'Open'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {attendance.totalHours !== null ? (
                          <span className="font-medium">{attendance.totalHours.toFixed(2)}h</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} records
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
                  disabled={!response?.hasMore}
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
  );
}
