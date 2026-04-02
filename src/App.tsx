import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChatPage } from '@/pages/ChatPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full">
        <ChatPage />
      </div>
    </QueryClientProvider>
  )
}
