export type EmployeeStatus = 'active' | 'inactive';

export type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  stateOfOrigin?: string;
  maritalStatus?: string;
  religion?: string;
  nin?: string;
  bvn?: string;
  passportPhoto?: string;
  nextOfKin?: string;
  hireDate?: string;
  employmentType?: string;
  employeeId?: string;
  salaryGrade?: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    sortCode?: string;
    branch?: string;
  };
  pensionPin?: string;
  healthInsuranceNumber?: string;
  leaveBalance?: number;
  lastPromotionDate?: string;
  probationEndDate?: string;
  resignationDate?: string;
  workLocation?: string;
  managerId?: string;
  skills?: string[];
  certifications?: {
    name: string;
    issuer?: string;
    dateIssued?: string;
    expiryDate?: string;
    certificateUrl?: string;
  }[];
  performanceScores?: {
    year: number;
    score: number;
    remarks?: string;
  }[];
  disciplinaryActions?: {
    date: string;
    action: string;
    description?: string;
    resolved?: boolean;
  }[];
  languagesSpoken?: string[];
  hobbies?: string[];
  linkedinUrl?: string;
  department?: string;
  jobTitle?: string;
  emergencyContacts?: {
    name: string;
    phone: string;
    address?: string;
    relationship: string;
    email?: string;
    notes?: string;
  }[];
  status?: EmployeeStatus;
};
