'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Settings, LogOut, Search, Sun, Moon, Layers, X, Clock } from 'lucide-react'
import { getAllTickets, updateTicketStatus } from '../api/adminApi'
import StatusBadge from './StatusBadge'
import TicketDetailPanel from './TicketDetailPanel'
import { deviceLabel } from '../utils/deviceLabel'
import type { Ticket, TicketStatus } from '../../ServicesSection/types/wizard'

interface TopBarProps {
  darkMode: boolean
  onToggleDark: () => void
  onLogout: () => void
  onNavigateToTickets: (search?: string) => void
  dismissed: string[]
  onUnreadCountChange: (count: number) => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs  < 24) return `${hrs}h ago`
  return `${days}d ago`
}

export default function TopBar({ darkMode, onToggleDark, onLogout, onNavigateToTickets, dismissed, onUnreadCountChange }: TopBarProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [openPanel, setOpenPanel] = useState<'notifications' | 'settings' | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const selectedTicket = tickets.find(t => t.ticketId === selectedTicketId) ?? null

  async function handleStatusChange(ticketId: string, status: TicketStatus) {
    // Optimistic update in local state
    setTickets(prev => prev.map(t => t.ticketId === ticketId ? { ...t, status } : t))
    try { await updateTicketStatus(ticketId, status) } catch {
      // Refetch on error
      getAllTickets().then(setTickets).catch(() => {})
    }
  }

  function openTicket(ticketId: string) {
    setOpenPanel(null)
    setSearchQuery('')
    setSelectedTicketId(ticketId)
  }

  useEffect(() => {
    getAllTickets().then(setTickets).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const searchResults = searchQuery.trim().length > 1
    ? tickets.filter(t => {
        const q = searchQuery.toLowerCase()
        return (
          t.ticketId.toLowerCase().includes(q) ||
          t.customer.name.toLowerCase().includes(q) ||
          t.customer.phone.includes(q) ||
          t.customer.email.toLowerCase().includes(q)
        )
      }).slice(0, 6)
    : []

  const newTickets = tickets
    .filter(t => t.status === 'received' && !dismissed.includes(t.ticketId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  useEffect(() => {
    onUnreadCountChange(newTickets.length)
  }, [newTickets.length, onUnreadCountChange])

  function handleSearchSelect(ticketId: string) {
    openTicket(ticketId)
  }

  function togglePanel(panel: 'notifications' | 'settings') {
    setOpenPanel(prev => prev === panel ? null : panel)
  }

  const PANEL_CLS = `
    absolute right-0 top-[calc(100%+8px)] z-50 rounded-xl shadow-xl
    bg-white dark:bg-[#1a1a1a]
    border border-[#e5e7eb] dark:border-[#262626]
    overflow-hidden
  `

  const iconBtn = (active: boolean) =>
    `w-8 h-8 rounded-lg flex items-center justify-center border transition-colors cursor-pointer ${
      active
        ? 'border-[#6366f1]/40 bg-[#6366f1]/8 text-[#6366f1] dark:text-[#818cf8]'
        : 'border-[#e5e7eb] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-[#6b7280] dark:text-[#737373] hover:bg-[#f5f5f5] dark:hover:bg-[#222] hover:text-[#111] dark:hover:text-white'
    }`

  return (
    <>
      {selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          onClose={() => setSelectedTicketId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
      {openPanel && (
        <div className="fixed inset-0 z-20" onClick={() => setOpenPanel(null)} />
      )}

      <header className="h-[60px] flex-shrink-0 flex items-center gap-3 px-5 bg-white dark:bg-[#141414] border-b border-[#e5e7eb] dark:border-[#1f1f1f] z-30 relative">

        {/* Brand */}
        <div className="flex items-center gap-2 flex-shrink-0 mr-1">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center flex-shrink-0">
            <Layers size={14} color="white" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <p className="text-[12.5px] font-bold text-[#111] dark:text-white whitespace-nowrap tracking-tight">Davis Cell</p>
            <p className="text-[9px] text-[#9ca3af] whitespace-nowrap uppercase tracking-widest font-medium">Admin</p>
          </div>
        </div>

        <div className="w-px h-6 bg-[#e5e7eb] dark:bg-[#262626] flex-shrink-0" />

        {/* Search */}
        <div ref={searchRef} className="relative max-w-[320px] flex-1">
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#e5e7eb] dark:border-[#262626] bg-[#f9f9f9] dark:bg-[#111]">
            <Search size={13} className="text-[#9ca3af] flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tickets…"
              className="bg-transparent text-[13px] text-[#111] dark:text-[#f0f0f0] placeholder-[#9ca3af] flex-1 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#9ca3af] hover:text-[#374151] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] rounded-xl shadow-xl border border-[#e5e7eb] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] overflow-hidden z-50">
              {searchResults.map(t => (
                <button
                  key={t.ticketId}
                  onClick={() => handleSearchSelect(t.ticketId)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f9f9f9] dark:hover:bg-[#222] transition-colors text-left border-b border-[#e5e7eb]/60 dark:border-[#262626]/60 last:border-0 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#111] dark:text-[#f0f0f0]">{t.customer.name}</span>
                      <span className="font-mono text-[11px] text-[#9ca3af]">#{t.ticketId}</span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] dark:text-[#737373] truncate mt-0.5">
                      {deviceLabel(t.device.type)}{t.device.brand ? ` · ${t.device.brand}` : ''} · {t.issues.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </button>
              ))}
              <button
                onClick={() => { setSearchQuery(''); onNavigateToTickets(searchQuery) }}
                className="w-full text-[12px] text-[#6366f1] dark:text-[#818cf8] font-medium px-4 py-2.5 hover:bg-[#f9f9f9] dark:hover:bg-[#222] transition-colors text-center cursor-pointer"
              >
                View all results for &quot;{searchQuery}&quot; →
              </button>
            </div>
          )}

          {searchQuery.trim().length > 1 && searchResults.length === 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] rounded-xl shadow-xl border border-[#e5e7eb] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] px-4 py-3 z-50">
              <p className="text-[13px] text-[#6b7280] dark:text-[#737373]">No tickets found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">

          {/* Dark / Light toggle */}
          <button
            onClick={onToggleDark}
            title={darkMode ? 'Light mode' : 'Dark mode'}
            className={iconBtn(false)}
          >
            {darkMode
              ? <Sun  size={14} className="text-amber-400" />
              : <Moon size={14} className="text-[#6b7280] dark:text-[#737373]" />
            }
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => togglePanel('notifications')}
              title="Notifications"
              className={`relative ${iconBtn(openPanel === 'notifications')}`}
            >
              <Bell size={14} />
              {newTickets.length > 0 && (
                <span className="absolute top-[5px] right-[5px] w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
              )}
            </button>

            {openPanel === 'notifications' && (
              <div className={`${PANEL_CLS} w-[340px]`}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb] dark:border-[#262626]">
                  <div>
                    <p className="text-[13px] font-bold text-[#111] dark:text-[#f5f5f5]">Notifications</p>
                    <p className="text-[11px] text-[#9ca3af]">{newTickets.length} new request{newTickets.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => setOpenPanel(null)}
                    className="text-[#9ca3af] hover:text-[#374151] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
                {newTickets.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[13px] text-[#9ca3af]">All caught up</div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-[#e5e7eb]/60 dark:divide-[#262626]/60">
                    {newTickets.map(t => (
                      <button
                        key={t.ticketId}
                        onClick={() => openTicket(t.ticketId)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#f9f9f9] dark:hover:bg-[#222] transition-colors text-left cursor-pointer"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#6366f1] flex-shrink-0 mt-1.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#111] dark:text-[#f0f0f0]">{t.customer.name}</p>
                          <p className="text-[11px] text-[#6b7280] dark:text-[#737373] truncate mt-0.5">
                            {deviceLabel(t.device.type)}{t.device.brand ? ` · ${t.device.brand}` : ''} · {t.issues.slice(0, 2).join(', ')}
                          </p>
                        </div>
                        <span className="text-[11px] text-[#9ca3af] flex-shrink-0 flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {timeAgo(t.createdAt)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="border-t border-[#e5e7eb] dark:border-[#262626] px-4 py-2.5">
                  <button
                    onClick={() => { setOpenPanel(null); onNavigateToTickets() }}
                    className="text-[12px] font-medium text-[#6366f1] dark:text-[#818cf8] hover:underline cursor-pointer"
                  >
                    View all tickets →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => togglePanel('settings')}
              title="Settings"
              className={iconBtn(openPanel === 'settings')}
            >
              <Settings size={14} />
            </button>

            {openPanel === 'settings' && (
              <div className={`${PANEL_CLS} w-[240px]`}>
                <div className="px-4 py-3 border-b border-[#e5e7eb] dark:border-[#262626]">
                  <p className="text-[13px] font-bold text-[#111] dark:text-[#f5f5f5]">Settings</p>
                </div>
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#e5e7eb]/60 dark:border-[#262626]/60">
                  <span className="text-[13px] text-[#374151] dark:text-[#d4d4d4]">Dark mode</span>
                  <button
                    onClick={onToggleDark}
                    className={`relative flex-shrink-0 transition-colors rounded-full cursor-pointer`}
                    style={{ height: '22px', width: '40px', background: darkMode ? '#6366f1' : '#e5e7eb' }}
                  >
                    <span
                      className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-all ${darkMode ? 'left-[20px]' : 'left-[3px]'}`}
                    />
                  </button>
                </div>
                <button
                  onClick={() => { setOpenPanel(null); onLogout() }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-[#374151] dark:text-[#d4d4d4] hover:bg-[#f9f9f9] dark:hover:bg-[#222] transition-colors cursor-pointer"
                >
                  <LogOut size={14} className="text-[#9ca3af]" />
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Logout shortcut */}
          <button
            onClick={onLogout}
            title="Sign out"
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e5e7eb] dark:border-[#262626] bg-white dark:bg-[#1a1a1a] text-[#9ca3af] hover:bg-[#f5f5f5] dark:hover:bg-[#222] hover:text-[#374151] dark:hover:text-white transition-colors cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>
    </>
  )
}
