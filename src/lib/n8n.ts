import type { N8nRequest, N8nResponse } from '@/types'

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string

export async function sendToN8n(payload: N8nRequest): Promise<N8nResponse> {
  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`n8n request failed: ${res.status}`)
  }

  return res.json() as Promise<N8nResponse>
}
