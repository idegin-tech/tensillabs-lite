'use client'

import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import MentionList, { type MentionListRef, type MentionItem } from './MentionList'

export function createMentionSuggestion(fetchMembers: (query: string) => Promise<MentionItem[]>) {
  return {
    char: '@',
    items: async ({ query }: { query: string }) => {
      try {
        const members = await fetchMembers(query)
        return members.slice(0, 10)
      } catch (error) {
        console.error('Error fetching members:', error)
        return []
      }
    },

    render: () => {
      let component: ReactRenderer<MentionListRef> | null = null
      let popup: TippyInstance[] | null = null

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          })

          if (!props.clientRect) {
            return
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            maxWidth: 'none',
            offset: [0, 8],
            zIndex: 9999,
            animation: 'shift-away',
            theme: 'light-border',
          })
        },

        onUpdate(props: any) {
          component?.updateProps(props)

          if (!props.clientRect) {
            return
          }

          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect,
          })
        },

        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup?.[0]?.hide()
            return true
          }

          return component?.ref?.onKeyDown(props) ?? false
        },

        onExit() {
          popup?.[0]?.destroy()
          component?.destroy()
          popup = null
          component = null
        },
      }
    },
  }
}
