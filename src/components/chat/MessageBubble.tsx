import { cn } from '@/lib/cn'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const time = new Date(message.created_at).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={cn('flex gap-2 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* アバター */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold',
          isUser
            ? 'bg-[#4a90d9] text-white'
            : 'text-white'
        )}
        style={!isUser ? { background: 'linear-gradient(135deg, #00c4cc, #4a90d9)' } : undefined}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      <div className={cn('flex flex-col gap-1 max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
            isUser
              ? 'rounded-tr-sm text-white'
              : 'rounded-tl-sm text-[#d0dff0]'
          )}
          style={isUser
            ? { background: 'linear-gradient(135deg, #4a90d9, #3a7bc8)' }
            : { background: '#243a63', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }
          }
        >
          {message.content}
        </div>
        <span className="text-[10px] text-[#8aadcc]">{time}</span>
      </div>
    </div>
  )
}
