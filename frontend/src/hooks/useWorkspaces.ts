import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import { WorkspaceMembershipResponse } from '../types/workspace.types';

interface UseWorkspacesParams {
  search?: string;
  limit?: number;
}

export const useWorkspaces = ({ search = '', limit = 10 }: UseWorkspacesParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['workspaces', 'memberships', search, limit],
    queryFn: async ({ pageParam = 1 }): Promise<WorkspaceMembershipResponse> => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: limit.toString(),
        sortBy: '-createdAt',
      });

      if (search.trim()) {
        params.append('search', search.trim());
      }

      return await apiClient.get(`/workspace-members/workspaces/me?${params}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.payload.hasNextPage ? lastPage.payload.nextPage : undefined;
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
