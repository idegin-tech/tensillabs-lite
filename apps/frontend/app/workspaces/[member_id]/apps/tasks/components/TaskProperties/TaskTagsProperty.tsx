'use client'

import React from 'react'
import { TaskPropertyProps } from '.'
import { TaskTag } from '@/types/tasks.types'
import {TagSelector} from '../TagSelector'

interface TaskTagsPropertyProps extends TaskPropertyProps {
  availableTags: TaskTag[]
  listId: string
}

export default function TaskTagsProperty({ value, onChange, availableTags, listId }: TaskTagsPropertyProps) {
  const selectedTags = value || []

  return (
    <TagSelector
      availableTags={availableTags}
      selectedTags={selectedTags}
      listId={listId}
      onChange={onChange!}
    />
  )
}
