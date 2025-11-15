import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbBeach, TbCalendarOff, TbUserEdit } from 'react-icons/tb';
import React from 'react';

export default function EmployeeActions() {
  return <>
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
        >
          <TbCalendarOff className="h-5 w-5 mr-3" />
          Request Leave
        </Button>
        <Button
          variant="outline"
          size="lg"
        >
          <TbBeach className="h-5 w-5 mr-3" />
          Request Time Off
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="col-span-2"
        >
          <TbUserEdit className="h-5 w-5 mr-3" />
          Edit Personal Information
        </Button>
      </CardContent>
    </Card>
  </>
}
