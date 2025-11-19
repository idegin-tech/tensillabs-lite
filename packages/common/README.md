# @repo/common

Common types, utilities, and scripts shared across the TensilLabs monorepo.

## Features

- **Types**: Shared TypeScript types including APP_KEY data structures
- **Scripts**: Utility scripts for generating APP_KEY tokens

## Usage

### Types

```typescript
import { AppKeyData, WorkspaceInfo, LicenseInfo } from '@repo/common/types';

const appKeyData: AppKeyData = {
  // ... your app key data
};
```

### Scripts

Generate an APP_KEY JWT token:

```bash
npm run generate:app-key
```

Or from the root of the monorepo:

```bash
npx turbo run generate:app-key --filter=@repo/common
```

## APP_KEY Structure

The APP_KEY is a JWT token that contains essential information about:

- **Organization**: Company/organization details
- **Workspace**: Current workspace configuration
- **License**: License type, expiration, and feature flags
- **Billing**: Subscription and payment status
- **Deployment**: Fly.io configuration and CORS origins

This token is used to:
- Validate license status
- Configure CORS origins dynamically
- Manage workspace permissions
- Track billing and subscription information