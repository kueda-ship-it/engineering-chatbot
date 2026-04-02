import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useChat } from '@/hooks/useChat'

// Phase 1: セッションIDは仮固定（Phase 2でSupabase Auth連携）
const MOCK_SESSION_ID = 'session-dev-001'
const MOCK_USER = { name: '上田 晃平', role: 'internal' as const }

export function ChatPage() {
  const { messages, isLoading, error, sendMessage, loadHistory } = useChat({
    sessionId: MOCK_SESSION_ID,
    userRole: MOCK_USER.role,
  })

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return (
    <div className="flex flex-col h-full" style={{ background: '#1e3154' }}>
      <Header
        userName={MOCK_USER.name}
        userRole={MOCK_USER.role}
        onLogout={() => console.log('logout')}
      />
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSend={sendMessage}
        />
      </div>
    </div>
  )
}
