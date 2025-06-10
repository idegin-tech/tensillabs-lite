# TanStack Query Setup - Production Ready

This project includes a production-ready TanStack Query (React Query) setup with proper error handling, caching strategies, and TypeScript support.

## Environment Configuration

### Environment Files
- `.env.local` - Local development environment
- `.env.production` - Production environment
- `.env.example` - Template for environment variables

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1  # Backend API URL
NEXT_PUBLIC_APP_URL=http://localhost:3001          # Frontend app URL
NEXT_PUBLIC_NODE_ENV=development                   # Environment mode
```

## Core Components

### 1. Query Client Configuration (`lib/query-client.ts`)
- Environment-specific settings (dev vs production)
- Optimized retry logic with exponential backoff
- Proper error handling for different HTTP status codes
- Smart refetch strategies

### 2. API Client (`lib/api-client.ts`)
- Request timeout handling with AbortController
- Automatic request ID generation for debugging
- Comprehensive error handling with custom ApiError class
- Built-in HTTP methods (GET, POST, PUT, PATCH, DELETE)

### 3. Query Provider (`components/QueryProvider.tsx`)
- Wraps the application with QueryClientProvider
- Development tools only in non-production environments
- Singleton pattern for query client

### 4. Custom Hooks (`hooks/use-api.ts`)
- `useApiQuery` - Wrapper for queries with consistent error handling
- `useApiMutation` - Wrapper for mutations with automatic auth handling
- `useInvalidateQueries` - Helper for cache invalidation

### 5. Query Keys Factory (`lib/query-keys.ts`)
- Centralized query key management
- Hierarchical key structure
- Type-safe query key generation

## Usage Examples

### Basic Query
```typescript
import { useWorkspaces } from '@/hooks/use-workspaces'

function WorkspacesList() {
  const { data, isLoading, error } = useWorkspaces()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.map(workspace => (
        <div key={workspace.id}>{workspace.name}</div>
      ))}
    </div>
  )
}
```

### Mutation with Optimistic Updates
```typescript
import { useCreateWorkspace } from '@/hooks/use-workspaces'

function CreateWorkspaceForm() {
  const createWorkspace = useCreateWorkspace()
  
  const handleSubmit = async (data: CreateWorkspaceData) => {
    try {
      await createWorkspace.mutateAsync(data)
      // Success handling
    } catch (error) {
      // Error handling
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={createWorkspace.isPending}
      >
        {createWorkspace.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

### Authentication with Query
```typescript
import { useCurrentUser, useLogin } from '@/hooks/use-auth'

function AuthStatus() {
  const { data: user, isLoading } = useCurrentUser()
  const login = useLogin()
  
  if (isLoading) return <div>Checking authentication...</div>
  
  return user ? (
    <div>Welcome, {user.user.email}</div>
  ) : (
    <button onClick={() => login.mutate({ email, password })}>
      Login
    </button>
  )
}
```

## Production Features

### Error Handling
- Automatic retry with exponential backoff
- Auth error handling (401/403) with cache clearing
- Network timeout handling
- Request cancellation support

### Caching Strategy
- Different stale times for development vs production
- Smart refetch policies
- Proper garbage collection timing
- Background refetching on reconnect

### Performance Optimizations
- Request deduplication
- Background updates
- Optimistic updates for mutations
- Selective cache invalidation

### Development Experience
- React Query DevTools in development only
- Request ID tracking for debugging
- Comprehensive TypeScript support
- Centralized error handling

## Best Practices

### Query Keys
- Use the query keys factory for consistency
- Include all dependencies in query keys
- Use hierarchical structure for easy invalidation

### Error Handling
- Always handle loading and error states
- Use custom error boundaries for graceful fallbacks
- Implement retry logic for critical operations

### Caching
- Set appropriate stale times based on data volatility
- Use query invalidation sparingly
- Prefer refetching over invalidation when possible

### Security
- Always use credentials: 'include' for authenticated requests
- Handle 401 errors by clearing user data
- Implement proper request timeouts

## API Integration

The setup is ready to integrate with your backend API. Simply:

1. Update the `NEXT_PUBLIC_API_URL` in your environment files
2. Create query hooks using the provided patterns
3. Use the hooks in your components

The system handles authentication, error states, loading states, and caching automatically.
