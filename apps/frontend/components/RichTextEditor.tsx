

'use client'

import React, { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useDebouncedCallback } from 'use-debounce'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
    TbBold, 
    TbItalic, 
    TbUnderline, 
    TbStrikethrough,
    TbList,
    TbListNumbers,
    TbQuote,
    TbCode,
    TbH1,
    TbH2,
    TbH3,
    TbH4,
    TbH5,
    TbH6,
    TbAlignLeft,
    TbAlignCenter,
    TbAlignRight,
    TbLink,
    TbUnlink,
    TbPhoto,
    TbHighlight,
    TbArrowBackUp,
    TbArrowForwardUp
} from 'react-icons/tb'

type Props = {
    onChange?: (value: string) => void
    value?: string
    placeholder?: string
    className?: string
    debounceMs?: number
    allowImage?: boolean
    allowHighlight?: boolean
    error?: string
    disabled?: boolean
    maxLength?: number
}

export default function RichTextEditor({
    onChange,
    value = '',
    placeholder = 'Start typing...',
    className,
    debounceMs = 300,
    allowImage = false,
    allowHighlight = false,
    error,
    disabled = false,
    maxLength
}: Props) {
    const debouncedOnChange = useDebouncedCallback(
        (content: string) => {
            onChange?.(content)
        },
        debounceMs
    )

    const extensions = [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3, 4, 5, 6]
            }
        }),
        Placeholder.configure({
            placeholder
        }),
        TextStyle,
        Color,
        Underline,
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-blue-600 hover:text-blue-800 underline',
                target: '_blank',
                rel: 'noopener noreferrer'
            }
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph']
        }),
        ...(allowHighlight ? [Highlight.configure({
            HTMLAttributes: {
                class: 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded'
            }
        })] : []),
        ...(allowImage ? [Image.configure({
            HTMLAttributes: {
                class: 'max-w-full h-auto rounded-lg'
            }
        })] : [])
    ]

    const editor = useEditor({
        extensions,
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            const text = editor.getText()
            
            // Check character limit if maxLength is specified
            if (maxLength && text.length > maxLength) {
                // Prevent exceeding the limit by undoing the last change
                editor.commands.undo()
                return
            }
            
            debouncedOnChange(html)
        }
    })

    // Update editor content when value prop changes
    useEffect(() => {
        if (editor && value !== undefined) {
            const currentContent = editor.getHTML()
            // Only update if content is actually different to avoid cursor issues
            if (value !== currentContent && value !== '') {
                editor.commands.setContent(value, false)
            } else if (value === '' && currentContent !== '<p></p>') {
                // Clear content if value is empty but editor has content
                editor.commands.clearContent(false)
            }
        }
    }, [value, editor])

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL:')
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('Enter URL:', previousUrl)

        if (url === null) return

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    if (!editor) {
        return (
            <div className={cn(
                "min-h-32 rounded-md border border-input bg-background animate-pulse",
                className
            )} />
        )
    }

    return (
        <div className={cn(
            "w-full rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring",
            error && "border-destructive focus-within:ring-destructive",
            disabled && "opacity-50 cursor-not-allowed",
            className
        )}>
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo() || disabled}
                    className="h-8 w-8 p-0"
                >
                    <TbArrowBackUp className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo() || disabled}
                    className="h-8 w-8 p-0"
                >
                    <TbArrowForwardUp className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    data-active={editor.isActive('heading', { level: 1 })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbH1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    data-active={editor.isActive('heading', { level: 2 })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbH2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    data-active={editor.isActive('heading', { level: 3 })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbH3 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    data-active={editor.isActive('heading', { level: 4 })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbH4 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    data-active={editor.isActive('heading', { level: 5 })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbH5 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    data-active={editor.isActive('heading', { level: 6 })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbH6 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    data-active={editor.isActive('bold')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbBold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    data-active={editor.isActive('italic')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbItalic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    data-active={editor.isActive('underline')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbUnderline className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    data-active={editor.isActive('strike')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbStrikethrough className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    data-active={editor.isActive('code')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbCode className="h-4 w-4" />
                </Button>

                {allowHighlight && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        data-active={editor.isActive('highlight')}
                        disabled={disabled}
                        className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                    >
                        <TbHighlight className="h-4 w-4" />
                    </Button>
                )}

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    data-active={editor.isActive({ textAlign: 'left' })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbAlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    data-active={editor.isActive({ textAlign: 'center' })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbAlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    data-active={editor.isActive({ textAlign: 'right' })}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbAlignRight className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    data-active={editor.isActive('bulletList')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbList className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    data-active={editor.isActive('orderedList')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbListNumbers className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    data-active={editor.isActive('blockquote')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbQuote className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    data-active={editor.isActive('link')}
                    disabled={disabled}
                    className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                >
                    <TbLink className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive('link') || disabled}
                    className="h-8 w-8 p-0"
                >
                    <TbUnlink className="h-4 w-4" />
                </Button>

                {allowImage && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addImage}
                        disabled={disabled}
                        className="h-8 w-8 p-0"
                    >
                        <TbPhoto className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="min-h-32 p-3">
                <EditorContent 
                    editor={editor} 
                    className={cn(
                        "prose prose-sm max-w-none focus:outline-none",
                        "prose-headings:font-bold prose-headings:text-foreground",
                        "prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6",
                        "prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-5",
                        "prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4",
                        "prose-h4:text-base prose-h4:mb-2 prose-h4:mt-3",
                        "prose-h5:text-sm prose-h5:mb-2 prose-h5:mt-3",
                        "prose-h6:text-xs prose-h6:mb-2 prose-h6:mt-3",
                        "prose-p:text-foreground prose-p:mb-3 prose-p:last:mb-0",
                        "prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800",
                        "prose-strong:text-foreground prose-strong:font-semibold",
                        "prose-em:text-foreground prose-em:italic", 
                        "prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm",
                        "prose-pre:bg-gray-100 prose-pre:dark:bg-gray-800 prose-pre:text-foreground prose-pre:rounded prose-pre:p-2",
                        "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:mb-3",
                        "prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-3 prose-ul:text-foreground",
                        "prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-3 prose-ol:text-foreground",
                        "prose-li:text-foreground",
                        "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[6rem]",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
                        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
                    )}
                />
            </div>

            {maxLength && editor && (
                <div className="px-3 pb-2 border-t border-border">
                    <p className={cn(
                        "text-xs text-right",
                        editor.getText().length > maxLength * 0.9 
                            ? "text-yellow-600 dark:text-yellow-400" 
                            : "text-muted-foreground",
                        editor.getText().length >= maxLength 
                            ? "text-destructive" 
                            : ""
                    )}>
                        {editor.getText().length} / {maxLength}
                    </p>
                </div>
            )}

            {error && (
                <div className="px-3 pb-2">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}
        </div>
    )
}
