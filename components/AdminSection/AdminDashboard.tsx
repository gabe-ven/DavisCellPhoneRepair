'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import OverviewView from './views/OverviewView'
import TicketsView from './views/TicketsView'
import CalendarView from './views/CalendarView'
import NotificationsView from './views/NotificationsView'

export type ViewType = 'home' | 'tickets' | 'calendar' | 'notifications'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboard() {
  const [activeView, setActiveView]       = useState<ViewType>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode]           = useState(true)
  const [ticketsSearch, setTicketsSearch] = useState('')
  // Dismissed notification IDs — persisted to localStorage so they survive refreshes
  const [dismissed, setDismissed] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('dcpr_dismissed_notifs') ?? '[]')
    } catch { return [] }
  })
  // Unread count reported back from TopBar (accounts for dismissals)
  const [unreadCount, setUnreadCount]     = useState(0)
  const router = useRouter()

  // Sync dismissed list to localStorage whenever it changes
  useEffect(() => {
    try { localStorage.setItem('dcpr_dismissed_notifs', JSON.stringify(dismissed)) } catch { /* ignore */ }
  }, [dismissed])

  useEffect(() => {
    const root = document.documentElement
    darkMode ? root.classList.add('dark') : root.classList.remove('dark')
  }, [darkMode])

  function handleToggleDark() {
    const root = document.documentElement
    root.classList.add('no-transitions')
    setDarkMode(prev => !prev)
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('no-transitions')))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function handleNavigateToTickets(search?: string) {
    setActiveView('tickets')
    setTicketsSearch(search ?? '')
  }

  function handleDismiss(id: string) {
    setDismissed(prev => [...prev, id])
  }

  function handleDismissAll(ids: string[]) {
    setDismissed(prev => [...new Set([...prev, ...ids])])
  }

  const handleUnreadCountChange = useCallback((count: number) => {
    setUnreadCount(count)
  }, [])

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#f4f4f4] dark:bg-[#0d0d0d]">
      <TopBar
        darkMode={darkMode}
        onToggleDark={handleToggleDark}
        onLogout={handleLogout}
        onNavigateToTickets={handleNavigateToTickets}
        dismissed={dismissed}
        onUnreadCountChange={handleUnreadCountChange}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view)
            if (view !== 'tickets') setTicketsSearch('')
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          unreadCount={unreadCount}
        />
        <main className="flex-1 overflow-y-auto p-8 bg-[#f4f4f4] dark:bg-[#0d0d0d]">
          {activeView === 'home'          && <OverviewView />}
          {activeView === 'tickets'       && <TicketsView key={ticketsSearch} initialSearch={ticketsSearch} />}
          {activeView === 'calendar'      && <CalendarView />}
          {activeView === 'notifications' && (
            <NotificationsView
              dismissed={dismissed}
              onDismiss={handleDismiss}
              onDismissAll={handleDismissAll}
            />
          )}
        </main>
      </div>
    </div>
  )
}
