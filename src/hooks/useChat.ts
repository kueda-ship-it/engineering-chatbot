import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { sendToN8n } from '@/lib/n8n'
import type { Message, UserRole } from '@/types'

interface UseChatOptions {
  sessionId: string
  userRole: UserRole
}

export function useChat({ sessionId, userRole }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) {
      setError('履歴の読み込みに失敗しました')
      return
    }
    setMessages(data ?? [])
  }, [sessionId])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    setError(null)

    // Supabase に保存
    await supabase.from('messages').insert(userMsg)

    try {
      // 直近20件を履歴として送信（コンテキスト上限対策）
      const history = messages.slice(-20).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await sendToN8n({
        message: content,
        session_id: sessionId,
        user_role: userRole,
        history,
      })

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        role: 'assistant',
        content: response.reply,
        created_at: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMsg])
      await supabase.from('messages').insert(assistantMsg)
    } catch {
      setError('回答の取得に失敗しました。再度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }, [messages, sessionId, userRole, isLoading])

  return { messages, isLoading, error, sendMessage, loadHistory }
}
