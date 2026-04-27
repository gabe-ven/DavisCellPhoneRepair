import { Bell, Settings, LogOut, Search, Sun, Moon, Layers } from 'lucide-react'

interface TopBarProps {
  darkMode: boolean
  onToggleDark: () => void
  onLogout: () => void
}

const ICN_BTN = `
  w-9 h-9 rounded-lg flex items-center justify-center
  border border-[#e5e7eb] dark:border-[#2a2a2a]
  bg-white dark:bg-[#1a1a1a]
  text-[#6b7280] dark:text-[#9ca3af]
  hover:bg-[#f5f5f5] dark:hover:bg-[#222]
  hover:text-[#111] dark:hover:text-white
`

export default function TopBar({ darkMode, onToggleDark, onLogout }: TopBarProps) {
  return (
    <header className="h-[60px] flex-shrink-0 flex items-center gap-4 px-5 bg-white dark:bg-[#141414] border-b border-[#e5e7eb] dark:border-[#2a2a2a]">

      {/* Brand */}
      <div className="flex items-center gap-2.5 flex-shrink-0 mr-1">
        <div className="w-8 h-8 rounded-lg bg-[#8B1A1A] flex items-center justify-center flex-shrink-0">
          <Layers size={15} color="white" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-bold text-[#111] dark:text-white whitespace-nowrap tracking-tight">
            Davis Cell
          </p>
          <p className="text-[10px] text-[#6b7280] whitespace-nowrap uppercase tracking-widest font-medium">
            Admin
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-[#e5e7eb] dark:bg-[#2a2a2a] flex-shrink-0" />

      {/* Search */}
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#e5e7eb] dark:border-[#2a2a2a] bg-[#f9f9f9] dark:bg-[#111] max-w-[300px] flex-1">
        <Search size={14} strokeWidth={2} className="text-[#9ca3af] flex-shrink-0" />
        <span className="text-[13px] text-[#9ca3af]">Search tickets…</span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">

        {/* Dark / Light toggle */}
        <button
          onClick={onToggleDark}
          title={darkMode ? 'Light mode' : 'Dark mode'}
          className={`${ICN_BTN}`}
        >
          {darkMode
            ? <Sun  size={15} strokeWidth={2} className="text-amber-400" />
            : <Moon size={15} strokeWidth={2} className="text-[#6b7280]" />
          }
        </button>

        {/* Notifications */}
        <button className={`${ICN_BTN} relative`} title="Notifications">
          <Bell size={15} strokeWidth={2} />
          <span className="absolute top-[7px] right-[7px] w-1.5 h-1.5 rounded-full bg-[#8B1A1A] border border-white dark:border-[#141414]" />
        </button>

        {/* Settings */}
        <button className={ICN_BTN} title="Settings">
          <Settings size={15} strokeWidth={2} />
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          title="Sign out"
          className={`${ICN_BTN} hover:!bg-red-50 dark:hover:!bg-red-950/30 hover:!text-[#8B1A1A] hover:!border-[#8B1A1A]/30`}
        >
          <LogOut size={15} strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}
