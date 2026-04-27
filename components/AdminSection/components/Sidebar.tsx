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
}

const NAV_ITEMS: { id: ViewType; label: string; icon: React.ReactNode; hasNotif?: boolean }[] = [
  { id: 'home',          label: 'Home',          icon: <Home      size={20} strokeWidth={1.8} /> },
  { id: 'tickets',       label: 'Tickets',        icon: <Ticket    size={20} strokeWidth={1.8} /> },
  { id: 'calendar',      label: 'Calendar',       icon: <Calendar  size={20} strokeWidth={1.8} /> },
  { id: 'merch',         label: 'Merch',          icon: <ShoppingBag size={20} strokeWidth={1.8} /> },
  { id: 'notifications', label: 'Notifications',  icon: <Bell      size={20} strokeWidth={1.8} />, hasNotif: true },
]

export default function Sidebar({ activeView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`
        flex flex-col flex-shrink-0 overflow-hidden
        bg-[#0d0d0d] border-r border-[#1f1f1f]
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
      style={{ transition: 'width 0.2s ease' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-7 overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-[#8B1A1A] flex items-center justify-center flex-shrink-0 shadow-lg">
          <Layers size={18} color="white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white text-[14px] font-bold leading-tight whitespace-nowrap tracking-tight">
              Davis Cell
            </p>
            <p className="text-[#6b7280] text-[11px] font-medium whitespace-nowrap uppercase tracking-widest">
              Repair Admin
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1f1f1f] mx-3 mb-3" />

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                relative flex items-center rounded-lg transition-colors text-left w-full
                ${collapsed ? 'px-0 py-3 justify-center' : 'px-3 py-2.5 gap-3'}
                ${isActive
                  ? 'bg-[#8B1A1A] text-white'
                  : 'text-[#9ca3af] hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-[14px] font-medium whitespace-nowrap">{item.label}</span>
              )}
              {item.hasNotif && (
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-[#8B1A1A] flex-shrink-0 ${
                    collapsed ? 'absolute top-2 right-2.5' : 'ml-auto'
                  } ${isActive ? 'bg-white/80' : ''}`}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-[#1f1f1f] mx-3 mt-2 mb-2" />

      {/* Collapse toggle */}
      <div className="px-2 pb-5">
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            flex items-center rounded-lg transition-colors w-full
            text-[#6b7280] hover:bg-white/5 hover:text-white
            ${collapsed ? 'px-0 py-3 justify-center' : 'px-3 py-2.5 gap-3'}
          `}
        >
          {collapsed
            ? <ChevronRight size={18} strokeWidth={1.8} />
            : (
              <>
                <ChevronLeft size={18} strokeWidth={1.8} />
                <span className="text-[13px] font-medium whitespace-nowrap">Collapse</span>
              </>
            )
          }
        </button>
      </div>
    </aside>
  )
}
