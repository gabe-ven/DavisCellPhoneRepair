import {
  Home,
  Ticket,
  Calendar,
  ShoppingBag,
  Bell,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react'
import type { ViewType } from '../AdminDashboard'

interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  collapsed: boolean
  onToggleCollapse: () => void
  unreadCount: number
}

const NAV_ITEMS: { id: ViewType; label: string; icon: React.ReactNode; hasNotif?: boolean }[] = [
  { id: 'home',          label: 'Home',         icon: <Home        size={19} strokeWidth={1.8} /> },
  { id: 'tickets',       label: 'Tickets',       icon: <Ticket      size={19} strokeWidth={1.8} /> },
  { id: 'calendar',      label: 'Calendar',      icon: <Calendar    size={19} strokeWidth={1.8} /> },
  { id: 'merch',         label: 'Merch',         icon: <ShoppingBag size={19} strokeWidth={1.8} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell        size={19} strokeWidth={1.8} />, hasNotif: true },
]

export default function Sidebar({ activeView, onViewChange, collapsed, onToggleCollapse, unreadCount }: SidebarProps) {
  return (
    <aside
      className={`
        flex flex-col flex-shrink-0 overflow-hidden
        bg-white dark:bg-[#0d0d0d]
        border-r border-[#e5e7eb] dark:border-[#1f1f1f]
        ${collapsed ? 'w-[64px]' : 'w-[230px]'}
      `}
      style={{ transition: 'width 0.2s ease' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3.5 pt-5 pb-6 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-[#8B1A1A] flex items-center justify-center flex-shrink-0">
          <Layers size={16} color="white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-[13px] font-bold text-[#111] dark:text-white leading-tight whitespace-nowrap tracking-tight">
              Davis Cell
            </p>
            <p className="text-[10px] text-[#9ca3af] whitespace-nowrap uppercase tracking-widest font-medium">
              Repair Admin
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#e5e7eb] dark:bg-[#1f1f1f] mx-3 mb-2" />

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1 pt-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                relative flex items-center rounded-lg transition-colors text-left w-full
                ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5 gap-3'}
                ${isActive
                  ? 'bg-[#8B1A1A] text-white'
                  : 'text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#f5f5f5] dark:hover:bg-white/5 hover:text-[#111] dark:hover:text-white'
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-[13.5px] font-medium whitespace-nowrap">{item.label}</span>
              )}
              {item.hasNotif && unreadCount > 0 && (
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-white/80' : 'bg-[#8B1A1A]'} ${
                    collapsed ? 'absolute top-2 right-2.5' : 'ml-auto'
                  }`}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom divider + collapse */}
      <div className="h-px bg-[#e5e7eb] dark:bg-[#1f1f1f] mx-3 mt-2 mb-2" />
      <div className="px-2 pb-4">
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            flex items-center rounded-lg transition-colors w-full
            text-[#9ca3af] hover:bg-[#f5f5f5] dark:hover:bg-white/5 hover:text-[#374151] dark:hover:text-white
            ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5 gap-3'}
          `}
        >
          {collapsed
            ? <ChevronRight size={17} strokeWidth={1.8} />
            : (
              <>
                <ChevronLeft size={17} strokeWidth={1.8} />
                <span className="text-[13px] font-medium whitespace-nowrap">Collapse</span>
              </>
            )
          }
        </button>
      </div>
    </aside>
  )
}
