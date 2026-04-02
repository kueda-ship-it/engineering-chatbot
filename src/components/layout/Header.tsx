import { LogOut, Wifi } from 'lucide-react'

interface HeaderProps {
  userName?: string
  userRole?: 'internal' | 'partner'
  onLogout?: () => void
}

export function Header({ userName, userRole, onLogout }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-5 h-14 flex-shrink-0"
      style={{
        background: '#0d1a30',
        borderBottom: '1px solid #243a63',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* ロゴ */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #00c4cc, #4a90d9)' }}
        >
          EC
        </div>
        <div>
          <span className="text-sm font-semibold text-white">Engineering Chatbot</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Wifi size={9} className="text-[#00c4cc]" />
            <span className="text-[10px] text-[#00c4cc]">オンライン</span>
          </div>
        </div>
      </div>

      {/* ユーザー情報 */}
      {userName && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-white font-medium">{userName}</p>
            <p className="text-[10px] text-[#8aadcc]">
              {userRole === 'internal' ? '社内エンジニア' : '外部協力会社'}
            </p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{ background: '#243a63' }}
              title="ログアウト"
            >
              <LogOut size={14} className="text-[#8aadcc]" />
            </button>
          )}
        </div>
      )}
    </header>
  )
}
