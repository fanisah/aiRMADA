/**
 * Satu bubble pesan dalam ChatWindow.
 *
 * @location apps/web/src/components/ai/ChatMessage.tsx
 * TODO: Props role: 'user' | 'assistant', content: string
 *       Beda alignment dan warna per role
 */
type Props = {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: Props) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs rounded-xl px-3 py-2 text-sm ${
          isUser ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {content}
      </div>
    </div>
  )
}
