'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Settings, LogOut, Search, Sun, Moon, X, Clock } from 'lucide-react'
import { getAllTickets } from '../api/adminApi'
import StatusBadge from './StatusBadge'
import { deviceLabel } from '../utils/deviceLabel'
import type { Ticket } from '../../ServicesSection/types/wizard'

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

const iconBtn = (active: boolean) =>
  `w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
    active
      ? 'bg-[#6366f1]/[0.08] dark:bg-[#6366f1]/[0.15] text-[#6366f1] dark:text-[#818cf8] border border-[#6366f1]/25'
      : 'border border-[#e8e8e8] dark:border-[#222] bg-white dark:bg-[#141414] text-[#888] dark:text-[#555] hover:border-[#d4d4d4] dark:hover:border-[#333] hover:text-[#111] dark:hover:text-[#d4d4d4]'
  }`

const DROPDOWN = `
  absolute right-0 top-[calc(100%+8px)] z-50 rounded-xl overflow-hidden
  bg-white dark:bg-[#161616]
  border border-[#e8e8e8] dark:border-[#222]
  shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
`

export default function TopBar({ darkMode, onToggleDark, onLogout, onNavigateToTickets, dismissed, onUnreadCountChange }: TopBarProps) {
  const [tickets, setTickets]         = useState<Ticket[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [openPanel, setOpenPanel]     = useState<'notifications' | 'settings' | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => { onUnreadCountChange(newTickets.length) }, [newTickets.length, onUnreadCountChange])

  function handleSearchSelect(ticketId: string) {
    setSearchQuery('')
    onNavigateToTickets(ticketId)
  }

  function togglePanel(panel: 'notifications' | 'settings') {
    setOpenPanel(prev => prev === panel ? null : panel)
  }

  return (
    <>
      {openPanel && <div className="fixed inset-0 z-20" onClick={() => setOpenPanel(null)} />}

      <header className="h-[56px] flex-shrink-0 flex items-center gap-3 px-5 bg-white dark:bg-[#0f0f0f] border-b border-[#ebebeb] dark:border-[#1a1a1a] z-30 relative">

        {/* Search */}
        <div ref={searchRef} className="relative max-w-[300px] flex-1">
          <div className="flex items-center gap-2 h-8 px-3 rounded-[8px] border border-[#e8e8e8] dark:border-[#222] bg-[#fafafa] dark:bg-[#141414]">
            <Search size={13} className="text-[#c0c0c0] dark:text-[#444] flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tickets…"
              className="bg-transparent text-[13px] text-[#111] dark:text-[#e0e0e0] placeholder-[#c0c0c0] dark:placeholder-[#444] flex-1 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#bbb] dark:text-[#555] hover:text-[#374151] dark:hover:text-[#d4d4d4] transition-colors">
                <X size={12} />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className={`${DROPDOWN} left-0 right-0 top-[calc(100%+8px)]`}>
              {searchResults.map(t => (
                <button
                  key={t.ticketId}
                  onClick={() => handleSearchSelect(t.ticketId)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#fafafa] dark:hover:bg-[#1e1e1e] transition-colors text-left border-b border-[#f4f4f4] dark:border-[#1f1f1f] last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#111] dark:text-[#f0f0f0]">{t.customer.name}</span>
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }} className="text-[11px] text-[#bbb] dark:text-[#555]">#{t.ticketId}</span>
                    </div>
                    <p className="text-[11px] text-[#aaa] dark:text-[#555] truncate mt-0.5">
                      {deviceLabel(t.device.type)}{t.device.brand ? ` · ${t.device.brand}` : ''} · {t.issues.slice(0, 2).join(', ')}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </button>
              ))}
              <button
                onClick={() => { setSearchQuery(''); onNavigateToTickets(searchQuery) }}
                className="w-full text-[12px] text-[#6366f1] dark:text-[#818cf8] font-medium px-4 py-2.5 hover:bg-[#fafafa] dark:hover:bg-[#1e1e1e] transition-colors text-center"
              >
                View all results for &quot;{searchQuery}&quot; →
              </button>
            </div>
          )}

          {searchQuery.trim().length > 1 && searchResults.length === 0 && (
            <div className={`${DROPDOWN} left-0 right-0 top-[calc(100%+8px)] px-4 py-3`}>
              <p className="text-[13px] text-[#aaa] dark:text-[#555]">No tickets found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">

          {/* Dark/Light */}
          <button onClick={onToggleDark} title={darkMode ? 'Light mode' : 'Dark mode'} className={iconBtn(false)}>
            {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => togglePanel('notifications')} title="Notifications" className={`relative ${iconBtn(openPanel === 'notifications')}`}>
              <Bell size={14} />
              {newTickets.length > 0 && (
                <span className="absolute top-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-[#6366f1] ring-[1.5px] ring-white dark:ring-[#0f0f0f]" />
              )}
            </button>

            {openPanel === 'notifications' && (
              <div className={`${DROPDOWN} w-[340px]`}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#f4f4f4] dark:border-[#1f1f1f]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#111] dark:text-[#f0f0f0]">Notifications</p>
                    <p className="text-[11px] text-[#aaa] dark:text-[#555] mt-0.5">{newTickets.length} new request{newTickets.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button onClick={() => setOpenPanel(null)} className="text-[#bbb] dark:text-[#555] hover:text-[#374151] dark:hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
                {newTickets.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[13px] text-[#bbb] dark:text-[#444]">All caught up</div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-[#f4f4f4] dark:divide-[#1f1f1f]">
                    {newTickets.map(t => (
                      <button
                        key={t.ticketId}
                        onClick={() => { setOpenPanel(null); onNavigateToTickets(t.ticketId) }}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#fafafa] dark:hover:bg-[#1e1e1e] transition-colors text-left"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] flex-shrink-0 mt-1.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#111] dark:text-[#f0f0f0]">{t.customer.name}</p>
                          <p className="text-[11px] text-[#aaa] dark:text-[#555] truncate mt-0.5">
                            {deviceLabel(t.device.type)}{t.device.brand ? ` · ${t.device.brand}` : ''} · {t.issues.slice(0, 2).join(', ')}
                          </p>
                        </div>
                        <span className="text-[11px] text-[#bbb] dark:text-[#444] flex-shrink-0 flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {timeAgo(t.createdAt)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <div className="border-t border-[#f4f4f4] dark:border-[#1f1f1f] px-4 py-2.5">
                  <button
                    onClick={() => { setOpenPanel(null); onNavigateToTickets() }}
                    className="text-[12px] font-medium text-[#6366f1] dark:text-[#818cf8] hover:underline"
                  >
                    View all tickets →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button onClick={() => togglePanel('settings')} title="Settings" className={iconBtn(openPanel === 'settings')}>
              <Settings size={14} />
            </button>

            {openPanel === 'settings' && (
              <div className={`${DROPDOWN} w-[220px]`}>
                <div className="px-4 py-3 border-b border-[#f4f4f4] dark:border-[#1f1f1f]">
                  <p className="text-[11px] font-bold text-[#aaa] dark:text-[#555] uppercase tracking-widest">Settings</p>
                </div>
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#f4f4f4] dark:border-[#1f1f1f]">
                  <span className="text-[13px] text-[#555] dark:text-[#aaa]">Dark mode</span>
                  <button
                    onClick={onToggleDark}
                    className="relative flex-shrink-0 rounded-full transition-colors"
                    style={{ height: '20px', width: '36px', background: darkMode ? '#6366f1' : '#e5e7eb' }}
                  >
                    <span className={`absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition-all ${darkMode ? 'left-[18px]' : 'left-[2px]'}`} />
                  </button>
                </div>
                <button
                  onClick={() => { setOpenPanel(null); onLogout() }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-[#555] dark:text-[#aaa] hover:bg-[#fafafa] dark:hover:bg-[#1e1e1e] transition-colors"
                >
                  <LogOut size={13} className="text-[#bbb] dark:text-[#444]" />
                  Sign out
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-[#e8e8e8] dark:bg-[#222] mx-0.5" />

          <button onClick={onLogout} title="Sign out" className={iconBtn(false)}>
            <LogOut size={14} />
          </button>
        </div>
      </header>
    </>
  )
}
