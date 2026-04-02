import { useState, useRef, useEffect } from 'react'
import './index.css'

interface Message {
  role: 'user' | 'bot'
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'こんにちは！フルタイムシステム カスタマーサポートです。どのようにお手伝いしましょうか？' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isComposing) return

    const userText = input
    setMessages((prev) => [...prev, { role: 'user', content: userText }])
    setInput('')
    setIsLoading(true)

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chat'
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: userText,
          sessionId: sessionId 
        })
      })

      if (!response.ok) throw new Error('Network error')

      const data = await response.json()
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        content: data.output || data.message || '申し訳ありません。応答を取得できませんでした。' 
      }])
      setIsLoading(false)

    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        content: '接続エラーが発生しました。n8n の設定を確認してください。' 
      }])
      setIsLoading(false)
    }
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center bg-bg-dark overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-liquid-gradient animate-liquid" />
      <div className="absolute inset-0 z-0 bg-orbs" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-3xl h-full flex flex-col">
        
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between glass-panel !border-x-0 !border-t-0 !rounded-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg ring-1 ring-white/20">
              FS
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">Customer Support</h1>
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-slow" />
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Live Now</span>
              </div>
            </div>
          </div>
          <button className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </header>

        {/* Message Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`bubble-container ${msg.role === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bubble-container bubble-bot !w-20 flex justify-center py-2 h-8">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce-subtle" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce-subtle" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce-subtle" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input Area */}
        <footer className="px-6 py-8 bg-gradient-to-t from-bg-dark to-transparent">
          <div className="glass-panel p-2 pl-4 rounded-[2rem] flex items-center gap-2 shadow-2xl ring-1 ring-white/10">
            <button className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <input
              className="flex-1 bg-transparent border-none outline-none py-3 text-white text-base placeholder-white/30"
              placeholder="メッセージを入力..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isComposing) {
                  handleSend()
                }
              }}
            />
            <button
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer group shadow-xl ${
                input.trim() 
                  ? 'bg-gradient-to-br from-indigo-500/90 to-blue-600/90 backdrop-blur-md ring-1 ring-white/30 text-white shadow-indigo-500/40 hover:shadow-indigo-500/60' 
                  : 'bg-white/5 backdrop-blur-sm ring-1 ring-white/10 text-white/20'
              }`}
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <svg 
                width="20" 
                height="20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                viewBox="0 0 24 24" 
                className={`transition-all duration-300 ${input.trim() ? 'translate-x-0.5 group-hover:translate-x-1' : ''}`}
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                <path d="M22 12L3 21L6.5 12L3 3L22 12Z" />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Tailwind CSS Powered UI</p>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default App
