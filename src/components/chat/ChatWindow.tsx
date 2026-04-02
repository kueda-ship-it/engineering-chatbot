import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ChatInput } from './ChatInput'
import type { Message } from '@/types'

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  error: string | null
  onSend: (message: string) => void
}

export function ChatWindow({ messages, isLoading, error, onSend }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full">
      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-[#8aadcc]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #00c4cc, #4a90d9)' }}
            >
              EC
            </div>
            <p className="text-sm text-center">
              Engineering Chatbot へようこそ。<br />
              手順案内や機番のステータス確認ができます。
            </p>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div
            className="text-sm text-red-300 px-4 py-2 rounded-lg mb-4"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  )
}
