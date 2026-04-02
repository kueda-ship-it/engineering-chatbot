import { useState, useRef, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div
      className="flex items-end gap-3 p-4 border-t"
      style={{ borderColor: '#243a63', background: '#1a2744' }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="メッセージを入力…（Shift+Enterで改行）"
        disabled={disabled}
        rows={1}
        className={cn(
          'flex-1 resize-none rounded-xl px-4 py-2.5 text-sm text-[#d0dff0] placeholder-[#8aadcc]',
          'focus:outline-none transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        style={{
          background: '#243a63',
          border: '1px solid #2a4a70',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
          minHeight: '42px',
          maxHeight: '160px',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#4a90d9' }}
        onBlur={e => { e.currentTarget.style.borderColor = '#2a4a70' }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          'transition-all duration-200 active:scale-95',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
        style={{
          background: value.trim() && !disabled
            ? 'linear-gradient(135deg, #00c4cc, #4a90d9)'
            : '#243a63',
        }}
      >
        <Send size={16} className="text-white" />
      </button>
    </div>
  )
}
