'use client'

import Mention from '@tiptap/extension-mention'
import { mergeAttributes } from '@tiptap/core'

export const CustomMention = Mention.extend({
  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          class: 'mention inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium text-sm border border-secondary/20 hover:bg-secondary/20 transition-colors',
        }
      ),
      `@${node.attrs.label ?? node.attrs.id}`,
    ]
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return {
            'data-id': attributes.id,
          }
        },
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: attributes => {
          if (!attributes.label) {
            return {}
          }

          return {
            'data-label': attributes.label,
          }
        },
      },
    }
  },
})

export default CustomMention
