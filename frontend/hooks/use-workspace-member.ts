'use client'

import { useMemo } from 'react'
import { useApiInfiniteQuery } from './use-api'
import { WorkspaceMembershipsResponse, GetMembershipsParams } from '@/types/workspace.types'

export function useWorkspaceMember(params: GetMembershipsParams = {}) {
  const { search = '', limit = 10, sortBy = '-createdAt' } = params

  const queryKey = ['workspace-memberships', search, limit.toString(), sortBy]
    const buildEndpoint = (page: number) => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      ...(search && { search }),
    })
    return `/workspace-members/workspaces/me?${searchParams.toString()}`
  }
  
  const query = useApiInfiniteQuery<WorkspaceMembershipsResponse>(
    queryKey,
    buildEndpoint,
    (lastPage) => lastPage.payload.hasNextPage ? lastPage.payload.nextPage : undefined,
    {
      staleTime: 5 * 60 * 1000,
    }
  )

  const flatData = useMemo(() => {
    return query.data?.pages.flatMap(page => (page as unknown as WorkspaceMembershipsResponse).payload.docs) ?? []
  }, [query.data])

  const hasNextPage = query.data?.pages[query.data.pages.length - 1] ? 
    (query.data.pages[query.data.pages.length - 1] as unknown as WorkspaceMembershipsResponse).payload.hasNextPage : false
  const totalCount = query.data?.pages[0] ? 
    (query.data.pages[0] as unknown as WorkspaceMembershipsResponse).payload.totalDocs : 0
  
  const workspaces = flatData.map(member => member.workspace)

  return {
    ...query,
    data: flatData,
    workspaces,
    hasNextPage,
    totalCount,
  }
}
