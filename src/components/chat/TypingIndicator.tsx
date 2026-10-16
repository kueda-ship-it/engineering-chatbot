import { Spinner } from '../shared/Spinner'

export function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-4">
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #00c4cc, #4a90d9)' }}
      >
        AI
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center"
        style={{ background: '#243a63' }}
      >
        <Spinner size={16} label="回答を作成中" />
      </div>
    </div>
  )
}
