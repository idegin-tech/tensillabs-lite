'use client'

import { useApiQuery, useApiMutation, useInvalidateQueries } from './use-api'
import { api } from '@/lib/api'
import useCommon from './use-common'

export interface CommentReaction {
  emoji: string
  memberIds: string[]
}

export interface CommentFile {
  id: string
  name: string
  size: number
  mimeType: string
  fileURL: string
  thumbnailURL?: string
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  createdById: string
  workspaceId: string
  taskId: string
  listId: string
  spaceId: string
  parentCommentId?: string
  reactions: CommentReaction[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
  files?: CommentFile[]
}

export interface GetCommentsResponse {
  data: {
    comments: Comment[]
    total: number
    page: number
    limit: number
  }
}

export interface CreateCommentResponse {
  data: {
    comment: Comment
    files: CommentFile[]
  }
}

export interface CreateCommentVariables {
  listId: string
  taskId: string
  content: string
  files?: File[]
  parentCommentId?: string
}

export interface UpdateCommentVariables {
  listId: string
  taskId: string
  commentId: string
  content: string
}

export interface DeleteCommentVariables {
  listId: string
  taskId: string
  commentId: string
}

export interface AddReactionVariables {
  listId: string
  taskId: string
  commentId: string
  emoji: string
}

export function useTaskComments(listId: string, taskId: string, page: number = 1, limit: number = 20) {
  return useApiQuery<GetCommentsResponse>(
    ['task-comments', taskId, String(page), String(limit)],
    `/lists/${listId}/tasks/${taskId}/comments?page=${page}&limit=${limit}`,
    {
      enabled: !!listId && !!taskId,
    }
  )
}

export function useCreateComment() {
  const { invalidate } = useInvalidateQueries()
  const { member_id } = useCommon()

  return useApiMutation<CreateCommentResponse, CreateCommentVariables>(
    async ({ listId, taskId, content, files, parentCommentId }) => {
      const formData = new FormData()
      formData.append('content', content)
      
      if (parentCommentId) {
        formData.append('parentCommentId', parentCommentId)
      }
      
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file)
        })
      }

      return api.post<CreateCommentResponse>(
        `/lists/${listId}/tasks/${taskId}/comments`,
        formData,
        {
          headers: {
            'X-Member-ID': member_id,
          },
        }
      )
    },
    {
      onSuccess: (_, variables) => {
        invalidate(['task-comments', variables.taskId])
      },
    }
  )
}

export function useUpdateComment() {
  const { invalidate } = useInvalidateQueries()
  const { member_id } = useCommon()

  return useApiMutation<any, UpdateCommentVariables>(
    async ({ listId, taskId, commentId, content }) => {
      return api.put(`/comments/${commentId}`, { content }, {
        headers: {
          'X-Member-ID': member_id,
        },
      })
    },
    {
      onSuccess: (_, variables) => {
        invalidate(['task-comments', variables.taskId])
      },
    }
  )
}

export function useDeleteComment() {
  const { invalidate } = useInvalidateQueries()
  const { member_id } = useCommon()

  return useApiMutation<any, DeleteCommentVariables>(
    async ({ commentId }) => {
      return api.delete(`/comments/${commentId}`, {
        headers: {
          'X-Member-ID': member_id,
        },
      })
    },
    {
      onSuccess: (_, variables) => {
        invalidate(['task-comments', variables.taskId])
      },
    }
  )
}

export function useAddReaction() {
  const { invalidate } = useInvalidateQueries()
  const { member_id } = useCommon()

  return useApiMutation<any, AddReactionVariables>(
    async ({ commentId, emoji }) => {
      return api.post(`/comments/${commentId}/reactions`, { emoji }, {
        headers: {
          'X-Member-ID': member_id,
        },
      })
    },
    {
      onSuccess: (_, variables) => {
        invalidate(['task-comments', variables.taskId])
      },
    }
  )
}

export function useRemoveReaction() {
  const { invalidate } = useInvalidateQueries()
  const { member_id } = useCommon()

  return useApiMutation<any, AddReactionVariables>(
    async ({ commentId, emoji }) => {
      return api.delete(`/comments/${commentId}/reactions`, {
        data: { emoji },
        headers: {
          'X-Member-ID': member_id,
        },
      })
    },
    {
      onSuccess: (_, variables) => {
        invalidate(['task-comments', variables.taskId])
      },
    }
  )
}
