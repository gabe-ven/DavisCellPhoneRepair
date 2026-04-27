// TopBar color tokens:
// bg: bg-white dark:bg-[#1c1c2e]
// border: border-gray-200 dark:border-[#2a2a3e]
// brand logo icon: bg-[#8B1A1A]
// notification dot: bg-[#8B1A1A]

import { Bell, Settings, LogOut, Search, Sun, Moon, Layers } from 'lucide-react'

interface TopBarProps {
  darkMode: boolean
  onToggleDark: () => void
}

export default function TopBar({ darkMode, onToggleDark }: TopBarProps) {
  return (
    <header className="h-[68px] flex-shrink-0 flex items-center gap-4 px-6 bg-white dark:bg-[#1c1c2e] border-b border-gray-200 dark:border-[#2a2a3e] transition-colors duration-200">

      {/* Brand — leftmost, before search */}
      <div className="flex items-center gap-2.5 flex-shrink-0 mr-2">
        <div className="w-9 h-9 rounded-xl bg-[#8B1A1A] flex items-center justify-center flex-shrink-0">
          <Layers size={18} color="white" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <div className="text-[14px] font-semibold text-gray-900 dark:text-white whitespace-nowrap">Davis Cell</div>
          <div className="text-[11px] text-gray-400 dark:text-[#8888aa] whitespace-nowrap">Repair Admin</div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-200 dark:bg-[#2a2a3e] flex-shrink-0" />

      {/* Search */}
      <div className="flex items-center gap-2.5 h-10 px-4 rounded-xl border border-gray-200 dark:border-[#2a2a3e] bg-gray-50 dark:bg-[#13131f] max-w-[320px] flex-1">
        <Search size={16} strokeWidth={2} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
        <span className="text-[14px] text-gray-400 dark:text-gray-500">Search tickets…</span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* Dark / Light mode toggle */}
        <button
          onClick={onToggleDark}
          className="flex items-center gap-2.5 h-10 px-3 rounded-xl border border-gray-200 dark:border-[#2a2a3e] bg-white dark:bg-[#1c1c2e] hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode
            ? <Sun size={17} strokeWidth={1.8} className="text-amber-400" />
            : <Moon size={17} strokeWidth={1.8} className="text-slate-500" />
          }
          <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${darkMode ? 'bg-[#8B1A1A]' : 'bg-gray-200'}`}>
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${darkMode ? 'left-[18px]' : 'left-0.5'}`}
            />
          </div>
        </button>

        {/* Notification */}
        <button className="relative w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 dark:border-[#2a2a3e] bg-white dark:bg-[#1c1c2e] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors">
          <Bell size={19} strokeWidth={1.8} />
          <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-[#8B1A1A] border-2 border-white dark:border-[#1c1c2e]" />
        </button>

        {/* Settings */}
        <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 dark:border-[#2a2a3e] bg-white dark:bg-[#1c1c2e] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors">
          <Settings size={19} strokeWidth={1.8} />
        </button>

        {/* Logout */}
        <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 dark:border-[#2a2a3e] bg-white dark:bg-[#1c1c2e] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors">
          <LogOut size={19} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}