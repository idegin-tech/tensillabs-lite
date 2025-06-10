export const queryKeys = {
  all: ['api'] as const,
  
  auth: () => [...queryKeys.all, 'auth'] as const,
  authUser: () => [...queryKeys.auth(), 'user'] as const,
  
  workspaces: () => [...queryKeys.all, 'workspaces'] as const,
  workspacesList: (filters?: any) => [...queryKeys.workspaces(), 'list', filters] as const,
  workspaceDetail: (id: string) => [...queryKeys.workspaces(), 'detail', id] as const,
  workspaceMembers: (id: string) => [...queryKeys.workspaces(), id, 'members'] as const,
  
  users: () => [...queryKeys.all, 'users'] as const,
  usersList: (filters?: any) => [...queryKeys.users(), 'list', filters] as const,
  userDetail: (id: string) => [...queryKeys.users(), 'detail', id] as const,
  
  projects: () => [...queryKeys.all, 'projects'] as const,
  projectsList: (workspaceId?: string, filters?: any) => 
    [...queryKeys.projects(), 'list', workspaceId, filters] as const,
  projectDetail: (id: string) => [...queryKeys.projects(), 'detail', id] as const,
  
  tasks: () => [...queryKeys.all, 'tasks'] as const,
  tasksList: (projectId?: string, filters?: any) => 
    [...queryKeys.tasks(), 'list', projectId, filters] as const,
  taskDetail: (id: string) => [...queryKeys.tasks(), 'detail', id] as const,
}
