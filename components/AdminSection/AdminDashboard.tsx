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
  const router = useRouter()

  useEffect(() => {
    const root = document.documentElement
    darkMode ? root.classList.add('dark') : root.classList.remove('dark')
  }, [darkMode])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-100 dark:bg-[#13131f] transition-colors duration-200">
      <TopBar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(prev => !prev)}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-8">
          {activeView === 'home'          && <OverviewView />}
          {activeView === 'tickets'       && <TicketsView />}
          {activeView === 'calendar'      && <CalendarView />}
          {activeView === 'notifications' && <NotificationsView />}
          {activeView === 'merch'         && (
            <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-base">
              Merch — coming soon
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
