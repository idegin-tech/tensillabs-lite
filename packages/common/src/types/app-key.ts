export interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LicenseInfo {
  type: 'trial' | 'basic' | 'pro' | 'enterprise';
  expiresAt: string;
  features: string[];
  maxUsers?: number;
  maxWorkspaces?: number;
}

export interface BillingInfo {
  customerId?: string;
  subscriptionId?: string;
  planId?: string;
  status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface DeploymentInfo {
  flyApiKey?: string;
  appName?: string;
  region?: string;
  domains: string[];
  corsOrigins: string[];
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