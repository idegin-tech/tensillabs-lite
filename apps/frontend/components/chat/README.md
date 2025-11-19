# Chat Bubble Components

Beautiful, reusable chat bubble components for the TensilLabs application. These components provide a complete chat interface with support for files, reactions, avatars with online status, and more.

## Components

### 1. ChatBubbleContainer
The main container component that wraps chat bubbles and provides:
- Avatar with online/offline/recently status indicator
- User name and timestamp
- Reactions display and picker
- Dropdown menu with actions (edit, delete, copy, report)
- Proper alignment for incoming/outgoing messages

**Props:**
```typescript
{
  avatar?: string | null
  initials: string
  name: string
  timestamp: string
  isCurrentUser?: boolean
  onlineStatus?: 'online' | 'offline' | 'recently'
  showAvatar?: boolean
  reactions?: ChatReaction[]
  onReactionClick?: (emoji: string, hasReacted: boolean) => void
  onAddReaction?: (emoji: string) => void
  onEdit?: () => void
  onDelete?: () => void
  onCopy?: () => void
  onReport?: () => void
  showDropdown?: boolean
  children: React.ReactNode
  className?: string
}
```

### 2. IncomingChatBubble
Displays incoming messages with a muted background and proper styling.

**Props:**
```typescript
{
  message: string
  files?: React.ReactNode
  className?: string
}
```

### 3. OutgoingChatBubble
Displays outgoing messages with primary color background and sending indicator.

**Props:**
```typescript
{
  message: string
  files?: React.ReactNode
  isSending?: boolean
  className?: string
}
```

### 4. ChatFilesCarousel
Displays attached files in a horizontal carousel or single file view.

**Props:**
```typescript
{
  files: ChatFile[]
  isOutgoing?: boolean
  onFileClick?: (file: ChatFile) => void
  onDownload?: (file: ChatFile) => void
  className?: string
}
```

**ChatFile Type:**
```typescript
{
  id: string
  name: string
  size: number
  type: string
  url: string
  thumbnailUrl?: string
}
```

### 5. ChatBubbleLoading
Beautiful skeleton loader with various patterns for incoming/outgoing messages with and without files.

**Props:**
```typescript
{
  count?: number
  showIncoming?: boolean
  showOutgoing?: boolean
  className?: string
}
```

### 6. ChatMessage (Unified Component)
High-level component that combines all chat bubble components for easy use.

**Props:**
```typescript
{
  data: ChatMessageData
  isSending?: boolean
  onReactionClick?: (emoji: string, hasReacted: boolean) => void
  onAddReaction?: (emoji: string) => void
  onEdit?: () => void
  onDelete?: () => void
  onCopy?: () => void
  onReport?: () => void
  onFileClick?: (file: ChatFile) => void
  onFileDownload?: (file: ChatFile) => void
  showAvatar?: boolean
  showDropdown?: boolean
  className?: string
}
```

## Usage Examples

### Basic Usage with ChatMessage

```tsx
import { ChatMessage, ChatBubbleLoading } from '@/components/chat'

function ChatList({ messages, isLoading }) {
  if (isLoading) {
    return <ChatBubbleLoading count={5} />
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          data={{
            id: message.id,
            message: message.content,
            isCurrentUser: message.isCurrentUser,
            user: {
              name: message.user.name,
              avatar: message.user.avatar,
              initials: message.user.initials,
              memberId: message.user.id
            },
            timestamp: message.timestamp,
            onlineStatus: message.user.onlineStatus,
            files: message.files,
            reactions: message.reactions
          }}
          onReactionClick={(emoji, hasReacted) => {
            console.log('Toggle reaction:', emoji, hasReacted)
          }}
          onAddReaction={(emoji) => {
            console.log('Add reaction:', emoji)
          }}
          onEdit={() => console.log('Edit message')}
          onDelete={() => console.log('Delete message')}
        />
      ))}
    </div>
  )
}
```

### Manual Composition

```tsx
import {
  ChatBubbleContainer,
  IncomingChatBubble,
  OutgoingChatBubble,
  ChatFilesCarousel
} from '@/components/chat'

function CustomMessage({ message, isCurrentUser }) {
  const filesCarousel = message.files?.length > 0 ? (
    <ChatFilesCarousel
      files={message.files}
      isOutgoing={isCurrentUser}
      onFileClick={(file) => window.open(file.url, '_blank')}
    />
  ) : undefined

  return (
    <ChatBubbleContainer
      avatar={message.user.avatar}
      initials={message.user.initials}
      name={message.user.name}
      timestamp={message.timestamp}
      isCurrentUser={isCurrentUser}
      onlineStatus={message.user.status}
      reactions={message.reactions}
      onReactionClick={(emoji, hasReacted) => {
        // Handle reaction toggle
      }}
      onAddReaction={(emoji) => {
        // Handle add reaction
      }}
    >
      {isCurrentUser ? (
        <OutgoingChatBubble
          message={message.content}
          files={filesCarousel}
          isSending={message.isSending}
        />
      ) : (
        <IncomingChatBubble
          message={message.content}
          files={filesCarousel}
        />
      )}
    </ChatBubbleContainer>
  )
}
```

### Loading State

```tsx
import { ChatBubbleLoading } from '@/components/chat'

function ChatLoadingState() {
  return (
    <div className="space-y-6 p-4">
      <ChatBubbleLoading
        count={5}
        showIncoming={true}
        showOutgoing={true}
      />
    </div>
  )
}
```

## Features

### Online Status Indicators
- **Green dot**: User is online
- **Gray dot**: User is offline
- **Yellow dot**: User was recently online

### Reactions
- Click on existing reactions to toggle your reaction
- Click the smile icon to add a new reaction
- Quick reactions available: 👍 ❤️ 🎉 👏 🔥 💯
- Full emoji picker for additional reactions

### File Attachments
- Single file: Displays as a card with thumbnail, name, and size
- Multiple files: Displays as a horizontal carousel
- Hover actions: Download and open buttons
- Automatic file size formatting

### Dropdown Actions
- **Outgoing messages**: Edit, Delete, Copy
- **Incoming messages**: Copy, Report
- Actions only visible on hover

## Styling

All components are built with:
- Tailwind CSS for styling
- Shadcn UI components (Avatar, Button, Dropdown, etc.)
- Smooth transitions and hover effects
- Responsive design
- Dark mode support through CSS variables

## Best Practices

1. Always provide proper error boundaries when using these components
2. Use ChatMessage for most cases (simpler API)
3. Use manual composition when you need custom layouts
4. Implement proper loading states with ChatBubbleLoading
5. Handle all callbacks (reactions, file actions, etc.) appropriately
6. Provide meaningful accessibility attributes when needed

## Dependencies

- React 18+
- Tailwind CSS
- Shadcn UI components
- emoji-picker-react
- react-icons (Tabler Icons)
- FileThumbnailRenderer component
