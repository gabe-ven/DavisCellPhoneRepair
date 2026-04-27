'use client'

// Color tokens:
// Brand primary: #8B1A1A
// Page bg: bg-gray-100 dark:bg-[#13131f]
// Surface: bg-white dark:bg-[#1c1c2e]
// Border: border-gray-200 dark:border-[#2a2a3e]
// TODO: auth guard — add middleware.ts check when auth is implemented

import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import OverviewView from './views/OverviewView'

export type ViewType = 'home' | 'tickets' | 'calendar' | 'merch' | 'notifications'

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<ViewType>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  // Dark mode must live on <html> for Tailwind's `dark:` classes to work globally
  useEffect(() => {
    const root = document.documentElement
    darkMode ? root.classList.add('dark') : root.classList.remove('dark')
  }, [darkMode])

  return (
    // Outer shell: full screen, column layout so topbar sits above everything
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-100 dark:bg-[#13131f] transition-colors duration-200">

      {/* TopBar — always full width, unaffected by sidebar */}
      <TopBar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(prev => !prev)}
      />

      {/* Below topbar: sidebar + main content side by side */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-8">
          {activeView === 'home' && <OverviewView />}
          {activeView === 'tickets' && (
            <p className="text-gray-400 dark:text-gray-500 text-base mt-4">Tickets view — coming in Phase 4</p>
          )}
          {activeView === 'calendar' && (
            <p className="text-gray-400 dark:text-gray-500 text-base mt-4">Calendar view — coming soon</p>
          )}
          {activeView === 'merch' && (
            <p className="text-gray-400 dark:text-gray-500 text-base mt-4">Merch view — coming soon</p>
          )}
          {activeView === 'notifications' && (
            <p className="text-gray-400 dark:text-gray-500 text-base mt-4">Notifications — coming soon</p>
          )}
        </main>
      </div>
    </div>
  )
}