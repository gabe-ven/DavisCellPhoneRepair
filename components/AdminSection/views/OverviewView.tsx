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
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-base">
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
        <p className="text-[15px] text-gray-400 dark:text-[#8888aa] font-normal mb-1">
          {getGreeting()}, welcome back 👋
        </p>
        <h1 className="text-[32px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
          Cesar 
        </h1>
        <p className="text-[15px] text-gray-400 dark:text-[#8888aa] mt-1">
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
      <div className="bg-white dark:bg-[#1c1c2e] border border-gray-200 dark:border-[#2a2a3e] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#2a2a3e]">
          <span className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">Recent Tickets</span>
          <button className="text-[13px] text-[#8B1A1A] font-medium hover:underline">View all →</button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Ticket ID', 'Customer', 'Device', 'Issue', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#2a2a3e]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTickets.map(ticket => (
              <tr key={ticket.ticketId} className="hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors">
                <td className="px-6 py-4 text-[13px] font-mono text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                  #{ticket.ticketId}
                </td>
                <td className="px-6 py-4 text-[15px] font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                  {ticket.customer.name}
                </td>
                <td className="px-6 py-4 text-[14px] text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                  {ticket.device.brand} {ticket.device.modelCustom ?? ticket.device.modelTrim ?? ''}
                </td>
                <td className="px-6 py-4 text-[14px] text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                  {ticket.issues[0]}
                </td>
                <td className="px-6 py-4 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 text-[14px] text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#2a2a3e]/50">
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
        <div className="bg-white dark:bg-[#1c1c2e] border border-gray-200 dark:border-[#2a2a3e] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-[#2a2a3e]">
            <span className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">Status Breakdown</span>
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
                  <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-[#2a2a3e] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR_COLORS[s]} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[13px] text-gray-400 dark:text-gray-500 min-w-[20px] text-right font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity — derived from real ticket data */}
        <div className="bg-white dark:bg-[#1c1c2e] border border-gray-200 dark:border-[#2a2a3e] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-[#2a2a3e]">
            <span className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">Recent Activity</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#2a2a3e]/70">
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
                    <span className="text-[14px] text-gray-700 dark:text-gray-300 flex-1 leading-snug">{msgs[t.status]}</span>
                    <span className="text-[12px] text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5">{timeAgo}</span>
                  </div>
                )
              })}
          </div>
        </div>

      </div>
    </div>
  )
}