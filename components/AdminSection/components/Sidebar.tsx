'use client'

import {
  LayoutDashboard,
  Ticket,
  CalendarDays,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { ViewType } from '../AdminDashboard'

interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  collapsed: boolean
  onToggleCollapse: () => void
  unreadCount: number
}

const NAV = [
  { id: 'home'          as ViewType, label: 'Overview',      Icon: LayoutDashboard },
  { id: 'tickets'       as ViewType, label: 'Tickets',       Icon: Ticket          },
  { id: 'calendar'      as ViewType, label: 'Calendar',      Icon: CalendarDays    },
  { id: 'notifications' as ViewType, label: 'Notifications', Icon: Bell, hasNotif: true },
]

export default function Sidebar({ activeView, onViewChange, collapsed, onToggleCollapse, unreadCount }: SidebarProps) {
  return (
    <aside
      className={`
        relative flex flex-col flex-shrink-0 overflow-hidden
        bg-white dark:bg-[#0b0b0b]
        border-r border-[#ebebeb] dark:border-[#1a1a1a]
        ${collapsed ? 'w-[56px]' : 'w-[224px]'}
      `}
      style={{ transition: 'width 0.18s cubic-bezier(0.4,0,0.2,1)' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 py-5 overflow-hidden ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
        <div
          className="w-7 h-7 rounded-[7px] bg-[#6366f1] flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 2px 8px rgba(99,102,241,0.25)' }}
        >
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', fontWeight: 700, color: 'white', letterSpacing: '-0.03em' }}>Dc</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-[13px] font-semibold text-[#111] dark:text-[#f0f0f0] whitespace-nowrap leading-tight" style={{ letterSpacing: '-0.015em' }}>
              Davis Cell
            </p>
            <p className="text-[9.5px] font-semibold text-[#c4c4c4] dark:text-[#363636] uppercase tracking-widest whitespace-nowrap mt-px">
              Admin
            </p>
          </div>
        )}
      </div>

      <div className="h-px bg-[#f0f0f0] dark:bg-[#171717] mx-3 mb-3" />

      {/* Nav */}
      <nav className="flex flex-col gap-px px-2 flex-1">
        {!collapsed && (
          <p className="text-[9.5px] font-bold text-[#c8c8c8] dark:text-[#2e2e2e] uppercase tracking-widest px-2 mb-2">
            Workspace
          </p>
        )}

        {NAV.map(({ id, label, Icon, hasNotif }) => {
          const active = activeView === id
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              title={collapsed ? label : undefined}
              className={`
                relative flex items-center rounded-[8px] w-full transition-colors duration-100 text-left
                ${collapsed ? 'justify-center py-2.5 px-0' : 'py-[7px] px-3 gap-2.5'}
                ${active
                  ? 'bg-[#6366f1]/[0.09] dark:bg-[#6366f1]/[0.15] text-[#4f51c8] dark:text-[#a5b4fc]'
                  : 'text-[#888] dark:text-[#484848] hover:bg-[#f6f6f6] dark:hover:bg-[#141414] hover:text-[#111] dark:hover:text-[#d4d4d4]'
                }
              `}
            >
              {/* Left border accent when active */}
              {active && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-[#6366f1] rounded-r-full" />
              )}

              <Icon size={16} strokeWidth={active ? 2 : 1.6} className="flex-shrink-0" />

              {!collapsed && (
                <span className="text-[13.5px] font-medium whitespace-nowrap flex-1">{label}</span>
              )}

              {hasNotif && unreadCount > 0 && (
                <span
                  className={`
                    w-[6px] h-[6px] rounded-full bg-[#6366f1] flex-shrink-0
                    ${collapsed ? 'absolute top-[6px] right-[6px]' : ''}
                  `}
                />
              )}
            </button>
          )
        })}
      </nav>

      <div className="h-px bg-[#f0f0f0] dark:bg-[#171717] mx-3 mt-3 mb-2" />

      {/* Collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            flex items-center rounded-[8px] w-full transition-colors
            text-[#b8b8b8] dark:text-[#333]
            hover:bg-[#f6f6f6] dark:hover:bg-[#141414]
            hover:text-[#374151] dark:hover:text-[#d4d4d4]
            ${collapsed ? 'justify-center py-2.5 px-0' : 'py-[7px] px-3 gap-2.5'}
          `}
        >
          {collapsed
            ? <ChevronRight size={15} strokeWidth={1.7} />
            : (
              <>
                <ChevronLeft size={15} strokeWidth={1.7} />
                <span className="text-[13px] font-medium whitespace-nowrap">Collapse</span>
              </>
            )
          }
        </button>
      </div>
    </aside>
  )
}
