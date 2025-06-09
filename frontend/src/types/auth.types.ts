export interface User {
  _id: string;
  email: string;
  timezone: string;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
