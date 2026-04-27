'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import OverviewView from './views/OverviewView'
import TicketsView from './views/TicketsView'
import CalendarView from './views/CalendarView'
import NotificationsView from './views/NotificationsView'

export type ViewType = 'home' | 'tickets' | 'calendar' | 'merch' | 'notifications'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<ViewType>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [ticketsSearch, setTicketsSearch] = useState('')
  const router = useRouter()

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

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#f5f5f5] dark:bg-[#0d0d0d]">
      <TopBar
        darkMode={darkMode}
        onToggleDark={handleToggleDark}
        onLogout={handleLogout}
        onNavigateToTickets={handleNavigateToTickets}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view)
            // Clear search when navigating away from tickets
            if (view !== 'tickets') setTicketsSearch('')
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-8 bg-[#f5f5f5] dark:bg-[#0d0d0d]">
          {activeView === 'home'          && <OverviewView />}
          {activeView === 'tickets'       && <TicketsView key={ticketsSearch} initialSearch={ticketsSearch} />}
          {activeView === 'calendar'      && <CalendarView />}
          {activeView === 'notifications' && <NotificationsView />}
          {activeView === 'merch'         && (
            <div className="flex items-center justify-center h-48 text-[#6b7280] text-base">
              Merch — coming soon
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
