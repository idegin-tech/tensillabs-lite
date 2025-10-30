import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Employee } from '@/types/employee.types';
import AppBody from '@/components/layout/app-layout/AppBody';

const mockEmployee: Employee = {
  _id: '1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  jobTitle: 'Product Manager',
  department: 'Product',
  phone: '+2348012345678',
  gender: 'female',
  workLocation: 'Lagos',
  hireDate: '2022-03-01',
  employeeId: 'EMP001',
  passportPhoto: '',
  status: 'active',
  address: '123 Main Street, Lagos',
  dateOfBirth: '1990-05-15',
  nationality: 'Nigerian',
};

export default function EmployeeDetailsPage() {
  const employee = mockEmployee;

  return (
    <>
      <AppBody>
        <div className="container mx-auto py-6 space-y-8">
          <div className="flex items-center space-x-6 bg-muted/20 p-6 rounded-lg">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={employee.passportPhoto || undefined}
                alt={employee.firstName}
              />
              <AvatarFallback className="text-2xl font-medium bg-primary/10 text-primary">
                {employee.firstName.charAt(0)}
                {employee.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-muted-foreground text-sm">
                {employee.jobTitle || 'No job title'}
              </p>
              <Badge variant="secondary" className="mt-2">
                {employee.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-base text-foreground">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-base text-foreground">{employee.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-base text-foreground">
                    {employee.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="text-base text-foreground">
                    {format(
                      new Date(employee.dateOfBirth || ''),
                      'MMMM d, yyyy',
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="text-base text-foreground">
                    {employee.nationality}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Work Location</p>
                  <p className="text-base text-foreground">
                    {employee.workLocation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppBody>
    </>
  );
}
