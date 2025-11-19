export interface DefaultWorkspaceMember {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
}

export interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  defaultMember: DefaultWorkspaceMember;
}

export interface LicenseInfo {
  expiresAt: Date;
  numberOfSeats: number;
}

export interface BillingInfo {
  amount: number;
  paymentFrequency: 'monthly' | 'yearly';
  gateway: 'paystack' | 'stripe';
}

export interface DeploymentInfo {
  flyApiKey: string;
  appName: string;
  domain: string;
}

export interface OrganizationInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
}

export interface AppKeyData {
  organization: OrganizationInfo;
  workspace: WorkspaceInfo;
  license: LicenseInfo;
  billing: BillingInfo;
  deployment: DeploymentInfo;
  createdAt: string;
  version: string;
}

export interface AppKeyJWT {
  data: AppKeyData;
  iat: number;
  exp?: number;
}