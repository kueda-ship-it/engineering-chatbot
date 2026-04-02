export type UserRole = 'internal' | 'partner'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

export interface Message {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface N8nRequest {
  message: string
  session_id: string
  user_role: UserRole
  history: { role: 'user' | 'assistant'; content: string }[]
}

export interface N8nResponse {
  reply: string
  intent?: 'faq' | 'status' | 'log' | 'escalation' | 'unknown'
}

// IRes / FC モックデータ型
export interface FcRecord {
  id: string          // 依頼番号 (A)
  machine_no: string  // 機番 (C)
  address: string     // 住所 (D)
  note: string        // 指示・備考 (E)
  status: 'received' | 'in_progress' | 'secondary' // ステータス (H)
  assignee: string    // 担当者 (I)
  vendor: string      // 業者 (J)
  amount: number      // 金額 (K)
  updated_at: string
}
