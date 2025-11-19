'use client'

import React, { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import DOMPurify from 'dompurify'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface MentionedMember {
  id: string
  label: string
  email?: string
}

interface MarkdownRendererProps {
  content: string
  className?: string
  allowHtml?: boolean
  collapsible?: boolean
  maxLength?: number
  mentionedMembers?: MentionedMember[]
}

export default function MarkdownRenderer({ 
  content, 
  className, 
  allowHtml = false, 
  collapsible = false, 
  maxLength = 300,
  mentionedMembers = []
}: MarkdownRendererProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const { displayContent, shouldTruncate } = useMemo(() => {
    if (!collapsible || content.length <= maxLength) {
      return { displayContent: content, shouldTruncate: false }
    }

    if (isExpanded) {
      return { displayContent: content, shouldTruncate: true }
    }

    // Find a good truncation point (end of sentence or paragraph)
    let truncateAt = maxLength
    const sentences = content.substring(0, maxLength + 100).split(/[.!?]\s+/)
    if (sentences.length > 1) {
      const lastComplete = sentences.slice(0, -1).join('. ')
      if (lastComplete.length <= maxLength + 50) {
        truncateAt = lastComplete.length + 1
      }
    }

    return {
      displayContent: content.substring(0, truncateAt),
      shouldTruncate: true
    }
  }, [content, maxLength, isExpanded, collapsible])

  const sanitizedContent = allowHtml && typeof window !== 'undefined' 
    ? DOMPurify.sanitize(displayContent, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'mark', 'code', 'pre',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li',
          'blockquote',
          'a', 'img',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'span'
        ],
        ALLOWED_ATTR: [
          'href', 'src', 'alt', 'title', 'target', 'rel',
          'class', 'style', 'data-type', 'data-id', 'data-label'
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      })
    : displayContent

  const rehypePlugins = allowHtml 
    ? [rehypeRaw, rehypeHighlight]
    : [rehypeHighlight]

  return (
    <div>
      <div className={cn(
          'select-text',
        'prose prose-sm max-w-none',
        'prose-headings:font-bold prose-headings:text-foreground',
        'prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6',
        'prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-5', 
        'prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4',
        'prose-p:text-foreground prose-p:mb-3 prose-p:last:mb-0',
        'prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-3',
        'prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-3',
        'prose-li:text-foreground',
        'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:mb-3',
        'prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm',
        className
      )}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={rehypePlugins}
          components={{
            h1: ({ children, ...props }) => (
              <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="text-xl font-bold mb-3 mt-5 text-foreground" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="text-lg font-bold mb-2 mt-4 text-foreground" {...props}>
                {children}
              </h3>
            ),
            h4: ({ children, ...props }) => (
              <h4 className="text-base font-bold mb-2 mt-3 text-foreground" {...props}>
                {children}
              </h4>
            ),
            h5: ({ children, ...props }) => (
              <h5 className="text-sm font-bold mb-2 mt-3 text-foreground" {...props}>
                {children}
              </h5>
            ),
            h6: ({ children, ...props }) => (
              <h6 className="text-xs font-bold mb-2 mt-3 text-foreground" {...props}>
                {children}
              </h6>
            ),
            img: ({ src, alt, ...props }) => (
              <img
                src={src}
                alt={alt}
                className="rounded-lg max-w-full h-auto"
                {...props}
              />
            ),
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                className="dark:text-blue-300 dark:hover:text-blue-600 underline text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            ),
            mark: ({ children, ...props }) => (
              <mark
                className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
                {...props}
              >
                {children}
              </mark>
            ),
            p: ({ children, ...props }) => (
              <p className="mb-3 last:mb-0" {...props}>
                {children}
              </p>
            ),
            ul: ({ children, ...props }) => (
              <ul className="list-disc pl-6 mb-3" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="list-decimal pl-6 mb-3" {...props}>
                {children}
              </ol>
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-3" {...props}>
                {children}
              </blockquote>
            ),
            code: ({ children, className, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              if (match) {
                return (
                  <code className={cn('block bg-gray-100 dark:bg-gray-800 rounded p-2 text-sm', className)} {...props}>
                    {children}
                  </code>
                )
              }
              return (
                <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm" {...props}>
                  {children}
                </code>
              )
            },
            span: ({ children, className, node, ...props }) => {
              const properties = (node as any)?.properties
              const dataType = properties?.dataType || properties?.['data-type']
              if (dataType === 'mention') {
                return (
                  <span
                    className="mention inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium text-sm border border-secondary/20 hover:bg-secondary/20 transition-colors"
                    {...props}
                  >
                    {children}
                  </span>
                )
              }
              return <span className={className} {...props}>{children}</span>
            }
          }}
        >
          {allowHtml ? sanitizedContent : displayContent}
        </ReactMarkdown>
      </div>
      
      {shouldTruncate && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary h-auto p-0 font-normal"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        </div>
      )}
    </div>
  )
}
