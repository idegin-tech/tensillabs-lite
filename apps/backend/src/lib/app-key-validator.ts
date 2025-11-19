import { z } from 'zod';
import * as jwt from 'jsonwebtoken';

const DefaultWorkspaceMemberSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const OrganizationInfoSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
});

const WorkspaceInfoSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  defaultMember: DefaultWorkspaceMemberSchema,
});

const LicenseInfoSchema = z.object({
  expiresAt: z.coerce.date(),
  numberOfSeats: z.number().positive(),
});

const BillingInfoSchema = z.object({
  amount: z.number().positive(),
  paymentFrequency: z.enum(['monthly', 'yearly']),
  gateway: z.enum(['paystack', 'stripe']),
});

const DeploymentInfoSchema = z.object({
  flyApiKey: z.string().min(1),
  appName: z.string().min(1),
  domain: z.string().min(1),
});

const AppKeyDataSchema = z.object({
  organization: OrganizationInfoSchema,
  workspace: WorkspaceInfoSchema,
  license: LicenseInfoSchema,
  billing: BillingInfoSchema,
  deployment: DeploymentInfoSchema,
  createdAt: z.string(),
  version: z.string().min(1),
});

const AppKeyJWTSchema = z.object({
  data: AppKeyDataSchema,
  iat: z.number(),
  exp: z.number().optional(),
  aud: z.string().optional(),
  iss: z.string().optional(),
});

export function parseAndValidateAppKey(appKeyToken: string, secretKey: string) {
  try {
    // Decode and verify JWT
    const decoded = jwt.verify(appKeyToken, secretKey, {
      audience: 'tensillabs-app',
      issuer: 'tensillabs',
    });

    // Validate the structure using Zod
    const validatedData = AppKeyJWTSchema.parse(decoded);

    return {
      success: true,
      data: validatedData.data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Invalid APP_KEY format',
    };
  }
}

export { AppKeyDataSchema, AppKeyJWTSchema };