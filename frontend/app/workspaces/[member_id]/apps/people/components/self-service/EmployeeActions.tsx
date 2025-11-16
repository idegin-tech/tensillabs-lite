import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TbBeach, TbCalendarOff, TbUserEdit, TbAlertCircle } from 'react-icons/tb';
import React, { useState } from 'react';
import CreateLeaveRequestDialog from '../CreateLeaveRequestDialog';
import { usePeople } from '../../contexts/people-app.context';

export default function EmployeeActions() {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showPendingAlert, setShowPendingAlert] = useState(false);
  const { state } = usePeople();

  const hasPendingRequest = !!state.pendingLeaveRequest;

  const handleLeaveRequestClick = () => {
    if (hasPendingRequest) {
      setShowPendingAlert(true);
    } else {
      setShowLeaveDialog(true);
    }
  };

  return <>
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLeaveRequestClick}
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
        </div>
      </CardContent>
    </Card>

    <CreateLeaveRequestDialog
      isOpen={showLeaveDialog}
      onClose={() => setShowLeaveDialog(false)}
      hasPendingRequest={hasPendingRequest}
    />

    <AlertDialog open={showPendingAlert} onOpenChange={setShowPendingAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TbAlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            Pending Leave Request
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2">
            You already have a pending leave request. Please wait for it to be processed before submitting another request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Understood</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
}
