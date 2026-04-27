// Sidebar color tokens:
// bg: bg-slate-100 dark:bg-[#1a1a2e]
// nav item active: bg-[#8B1A1A] text-white (both modes)
// nav item hover: bg-slate-200 dark:bg-white/5
// nav item text: text-slate-500 dark:text-[#8888aa]
// logo text: text-slate-800 dark:text-white
// logo subtext: text-slate-400 dark:text-[#a0a0b8]
// collapse button: text-slate-400 dark:text-[#8888aa]

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
    { id: 'home', label: 'Home', icon: <Home size={22} strokeWidth={1.8} /> },
    { id: 'tickets', label: 'Tickets', icon: <Ticket size={22} strokeWidth={1.8} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={22} strokeWidth={1.8} /> },
    { id: 'merch', label: 'Merch', icon: <ShoppingBag size={22} strokeWidth={1.8} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={22} strokeWidth={1.8} />, hasNotif: true },
  ]
  
  export default function Sidebar({ activeView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) {
    return (
      <aside
        className={`
          flex flex-col bg-slate-100 dark:bg-[#1a1a2e] transition-all duration-300 overflow-hidden flex-shrink-0 border-r border-slate-200 dark:border-transparent
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-8 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[#8B1A1A] flex items-center justify-center flex-shrink-0">
            <Layers size={20} color="white" strokeWidth={2} />
          </div>
          {!collapsed && (
            <div className="text-slate-800 dark:text-white text-[15px] font-semibold leading-snug whitespace-nowrap">
              Davis Cell<br />
              <span className="text-slate-400 dark:text-[#a0a0b8] font-normal text-[13px]">Repair Admin</span>
            </div>
          )}
        </div>
  
        {/* Nav */}
        <nav className="flex flex-col gap-1.5 px-3">
          {NAV_ITEMS.map(item => {
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`
                  relative flex items-center rounded-xl transition-all duration-150 text-left w-full
                  ${collapsed ? 'px-0 py-3.5 justify-center' : 'px-4 py-3.5 gap-4'}
                  ${isActive
                    ? 'bg-[#8B1A1A] text-white'
                    : 'text-slate-500 dark:text-[#8888aa] hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-gray-200'
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-[15px] font-medium whitespace-nowrap">{item.label}</span>
                )}
                {item.hasNotif && (
                  <span
                    className={`w-2 h-2 rounded-full bg-[#e05555] flex-shrink-0 ${
                      collapsed ? 'absolute top-2 right-2' : 'ml-auto'
                    }`}
                  />
                )}
              </button>
            )
          })}
  
          {/* Collapse toggle — sits right below nav items */}
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`
              relative flex items-center rounded-xl transition-all duration-150 text-left w-full mt-2
              text-slate-400 dark:text-[#8888aa] hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-gray-200
              ${collapsed ? 'px-0 py-3.5 justify-center' : 'px-4 py-3.5 gap-4'}
            `}
          >
            {collapsed
              ? <ChevronRight size={22} strokeWidth={1.8} />
              : (
                <>
                  <ChevronLeft size={22} strokeWidth={1.8} />
                  <span className="text-[15px] font-medium whitespace-nowrap">Collapse</span>
                </>
              )
            }
          </button>
        </nav>
      </aside>
    )
  }