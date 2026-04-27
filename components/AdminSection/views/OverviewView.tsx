import { Ticket, Wrench, CheckCircle, Calendar } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useTickets } from '../hooks/useTickets'

const STATUS_BAR_COLORS: Record<string, string> = {
  received:  'bg-blue-500',
  reviewing: 'bg-yellow-400',
  in_repair: 'bg-orange-500',
  ready:     'bg-green-500',
  completed: 'bg-gray-400',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function OverviewView() {
  const { tickets, loading, error } = useTickets()

  const stats = {
    total:     tickets.length,
    received:  tickets.filter(t => t.status === 'received').length,
    reviewing: tickets.filter(t => t.status === 'reviewing').length,
    in_repair: tickets.filter(t => t.status === 'in_repair').length,
    ready:     tickets.filter(t => t.status === 'ready').length,
    completed: tickets.filter(t => t.status === 'completed').length,
    todayAppts: tickets.filter(t => t.appointment.date === new Date().toISOString().split('T')[0]).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-[#9ca3af] dark:text-[#6b7280] text-base">
        Loading…
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-base mt-4">{error}</p>
  }

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome header */}
      <div className="mb-2">
        <p className="text-[15px] text-[#9ca3af] dark:text-[#6b7280] font-normal mb-1">
          {getGreeting()}, welcome back 👋
        </p>
        <h1 className="text-[32px] font-bold text-[#111111] dark:text-[#f5f5f5] leading-tight tracking-tight">
          Cesar 
        </h1>
        <p className="text-[15px] text-[#9ca3af] dark:text-[#6b7280] mt-1">
          Here's what's happening at Davis Cell Phone Repair today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Tickets"
          value={stats.total}
          subtext={<span><b className="text-[#8B1A1A]">+6</b> this week</span>}
          icon={<Ticket size={18} strokeWidth={2} className="text-[#8B1A1A]" />}
          iconBg="bg-red-50 dark:bg-red-950/60"
        />
        <StatCard
          label="In Repair"
          value={stats.in_repair}
          subtext="Active repairs"
          icon={<Wrench size={18} strokeWidth={2} className="text-orange-500" />}
          iconBg="bg-orange-50 dark:bg-orange-950/60"
        />
        <StatCard
          label="Ready for Pickup"
          value={stats.ready}
          subtext="Awaiting pickup"
          icon={<CheckCircle size={18} strokeWidth={2} className="text-green-500" />}
          iconBg="bg-green-50 dark:bg-green-950/60"
        />
        <StatCard
          label="Appointments Today"
          value={stats.todayAppts}
          subtext="Today's bookings"
          icon={<Calendar size={18} strokeWidth={2} className="text-blue-500" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
        />
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
          <span className="text-[16px] font-semibold text-[#111111] dark:text-[#f0f0f0]">Recent Tickets</span>
          <button className="text-[13px] text-[#8B1A1A] font-medium hover:underline">View all →</button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Ticket ID', 'Customer', 'Device', 'Issue', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-[11px] font-semibold text-[#9ca3af] dark:text-[#6b7280] uppercase tracking-wider border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTickets.map(ticket => (
              <tr key={ticket.ticketId} className="hover:bg-[#f9f9f9] dark:hover:bg-[#222] transition-colors">
                <td className="px-6 py-4 text-[13px] font-mono text-[#9ca3af] dark:text-[#6b7280] border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                  #{ticket.ticketId}
                </td>
                <td className="px-6 py-4 text-[15px] font-semibold text-[#111111] dark:text-[#f0f0f0] border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                  {ticket.customer.name}
                </td>
                <td className="px-6 py-4 text-[14px] text-[#374151] dark:text-[#a3a3a3] border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                  {ticket.device.brand} {ticket.device.modelCustom ?? ticket.device.modelTrim ?? ''}
                </td>
                <td className="px-6 py-4 text-[14px] text-[#374151] dark:text-[#a3a3a3] border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                  {ticket.issues[0]}
                </td>
                <td className="px-6 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 text-[14px] text-[#9ca3af] dark:text-[#6b7280] border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
            <span className="text-[16px] font-semibold text-[#111111] dark:text-[#f0f0f0]">Status Breakdown</span>
          </div>
          <div className="flex flex-col gap-3 px-6 py-4">
            {(['received', 'reviewing', 'in_repair', 'ready', 'completed'] as const).map(s => {
              const count = stats[s as keyof typeof stats] as number
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-[90px] flex-shrink-0">
                    <StatusBadge status={s} />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-[#f5f5f5] dark:bg-[#2a2a3e] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR_COLORS[s]} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[13px] text-[#9ca3af] dark:text-[#6b7280] min-w-[20px] text-right font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity — derived from real ticket data */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
            <span className="text-[16px] font-semibold text-[#111111] dark:text-[#f0f0f0]">Recent Activity</span>
          </div>
          <div className="divide-y divide-[#e5e7eb] dark:divide-[#2a2a2a]/70">
            {[...tickets]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 4)
              .map(t => {
                const dotColors: Record<string, string> = {
                  received: '#8B1A1A', reviewing: '#f59e0b',
                  in_repair: '#f97316', ready: '#22c55e', completed: '#9ca3af',
                }
                const msgs: Record<string, string> = {
                  received:  `New ticket #${t.ticketId} submitted by ${t.customer.name}`,
                  reviewing: `#${t.ticketId} is under review — ${t.customer.name}`,
                  in_repair: `Repair started on #${t.ticketId} — ${t.device.brand ?? ''} ${t.device.modelCustom ?? t.device.modelTrim ?? ''}`.trim(),
                  ready:     `#${t.ticketId} marked ready for pickup — ${t.customer.name}`,
                  completed: `#${t.ticketId} completed for ${t.customer.name}`,
                }
                const diff = Date.now() - new Date(t.createdAt).getTime()
                const mins = Math.floor(diff / 60000)
                const hrs  = Math.floor(diff / 3600000)
                const days = Math.floor(diff / 86400000)
                const timeAgo = mins < 1 ? 'just now' : mins < 60 ? `${mins}m ago` : hrs < 24 ? `${hrs}h ago` : `${days}d ago`
                return (
                  <div key={t.ticketId} className="flex items-start gap-4 px-6 py-4">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: dotColors[t.status] ?? '#9ca3af' }} />
                    <span className="text-[14px] text-[#374151] dark:text-[#a3a3a3] flex-1 leading-snug">{msgs[t.status]}</span>
                    <span className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] flex-shrink-0 mt-0.5">{timeAgo}</span>
                  </div>
                )
              })}
          </div>
        </div>

      </div>
    </div>
  )
}