'use client'

import { useState, useRef } from 'react'
import { Search, Plus, CheckCircle, UserRound, Phone } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import CreateTicketModal from '../components/CreateTicketModal'
import TicketDetailPanel from '../components/TicketDetailPanel'
import { useTickets } from '../hooks/useTickets'
import { updateAssignedTo } from '../api/adminApi'
import { deviceLabel } from '../utils/deviceLabel'
import type { TicketStatus } from '../types/admin'

const QUICK_OPTS: { value: TicketStatus; label: string; active: string; idle: string }[] = [
  { value: 'received',  label: 'Rcvd',   active: 'bg-blue-500 text-white border-blue-500',    idle: 'border-[#e8e8e8] dark:border-[#222] text-[#555] dark:text-[#777] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]' },
  { value: 'reviewing', label: 'Review', active: 'bg-yellow-400 text-white border-yellow-400', idle: 'border-[#e8e8e8] dark:border-[#222] text-[#555] dark:text-[#777] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]' },
  { value: 'in_repair', label: 'Repair', active: 'bg-orange-500 text-white border-orange-500', idle: 'border-[#e8e8e8] dark:border-[#222] text-[#555] dark:text-[#777] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]' },
  { value: 'ready',     label: 'Ready',  active: 'bg-green-500 text-white border-green-500',  idle: 'border-[#e8e8e8] dark:border-[#222] text-[#555] dark:text-[#777] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]' },
  { value: 'completed', label: 'Done',   active: 'bg-[#737373] text-white border-[#737373]',  idle: 'border-[#e8e8e8] dark:border-[#222] text-[#555] dark:text-[#777] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]' },
]

function StatusQuickUpdate({
  ticketId, status, onUpdate, disabled,
}: { ticketId: string; status: TicketStatus; onUpdate: (id: string, s: TicketStatus) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button onClick={e => { e.stopPropagation(); setOpen(true) }} title="Click to change status" className="hover:opacity-75 transition-opacity">
        <StatusBadge status={status} />
      </button>
    )
  }

  return (
    <div onClick={e => e.stopPropagation()} className="flex flex-col gap-1">
      {QUICK_OPTS.map(opt => (
        <button
          key={opt.value}
          disabled={disabled}
          onClick={() => { onUpdate(ticketId, opt.value); setOpen(false) }}
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-colors disabled:opacity-50 text-left ${
            status === opt.value ? opt.active : opt.idle
          }`}
        >
          {status === opt.value ? '✓ ' : ''}{opt.label}
        </button>
      ))}
      <button onClick={() => setOpen(false)} className="text-[10px] text-[#aaa] dark:text-[#555] text-center mt-0.5 hover:text-[#374151] dark:hover:text-[#d4d4d4] transition-colors">
        Cancel
      </button>
    </div>
  )
}

function AssigneeCell({ ticketId, value }: { ticketId: string; value: string | null | undefined }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation()
    setDraft(value ?? '')
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function save() {
    setEditing(false); setSaving(true)
    try { await updateAssignedTo(ticketId, draft.trim() || null) } catch { /* resync */ } finally { setSaving(false) }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef} value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save} onKeyDown={onKeyDown}
        onClick={e => e.stopPropagation()}
        placeholder="Name…"
        className="w-full px-2 py-1 text-[13px] rounded-md border border-[#6366f1]/40 bg-white dark:bg-[#111] text-[#111] dark:text-[#f0f0f0] focus:outline-none focus:ring-1 focus:ring-[#6366f1]/40"
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      className={`flex items-center gap-1.5 text-[13px] rounded-md px-2 py-1 w-full text-left hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition-colors ${saving ? 'opacity-50' : ''}`}
    >
      <UserRound size={13} className={value ? 'text-[#6366f1] dark:text-[#818cf8]' : 'text-[#ccc] dark:text-[#444]'} />
      <span className={value ? 'text-[#333] dark:text-[#d4d4d4]' : 'text-[#ccc] dark:text-[#444] italic'}>
        {saving ? '…' : (value || 'Unassigned')}
      </span>
    </button>
  )
}

const STATUS_FILTERS = ['all', 'received', 'reviewing', 'in_repair', 'ready', 'completed'] as const
type Filter = typeof STATUS_FILTERS[number]

interface TicketsViewProps {
  initialSearch?: string
}

export default function TicketsView({ initialSearch = '' }: TicketsViewProps) {
  const { tickets, loading, error, updateStatus, refetch } = useTickets()
  const [filter, setFilter]             = useState<Filter>('all')
  const [search, setSearch]             = useState(initialSearch)
  const [updatingId, setUpdatingId]     = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  const filtered = tickets
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => {
      const q = search.toLowerCase()
      return (
        t.ticketId.toLowerCase().includes(q) ||
        t.customer.name.toLowerCase().includes(q) ||
        t.customer.email.toLowerCase().includes(q) ||
        t.customer.phone.includes(q)
      )
    })

  const selectedTicket = tickets.find(t => t.ticketId === selectedTicketId) ?? null

  async function handleStatusChange(ticketId: string, status: TicketStatus) {
    setUpdatingId(ticketId)
    await updateStatus(ticketId, status)
    setUpdatingId(null)
  }

  function handleCreated(ticketId: string) {
    setShowCreateModal(false)
    setCreatedTicketId(ticketId)
    refetch()
    setTimeout(() => setCreatedTicketId(null), 5000)
  }

  return (
    <>
      {showCreateModal && (
        <CreateTicketModal onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />
      )}

      {selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          onClose={() => setSelectedTicketId(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[30px] font-bold text-[#111] dark:text-[#f0f0f0] leading-tight" style={{ letterSpacing: '-0.025em' }}>
              Tickets
            </h1>
            <p className="text-[14px] text-[#aaa] dark:text-[#555] mt-0.5">
              Click any row for full details. Click the status badge to update quickly.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] active:scale-95 mt-1 transition-all"
          >
            <Plus size={15} />
            New Ticket
          </button>
        </div>

        {createdTicketId && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40">
            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            <p className="text-[13px] font-medium text-green-700 dark:text-green-400">
              Ticket <span style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>#{createdTicketId}</span> created successfully.
            </p>
          </div>
        )}

        {/* Filters + Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-[7px] text-[12.5px] font-medium transition-colors ${
                  filter === s
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-white dark:bg-[#141414] border border-[#e8e8e8] dark:border-[#222] text-[#555] dark:text-[#777] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]'
                }`}
              >
                {s === 'all' ? 'All' : s === 'in_repair' ? 'In Repair' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 h-8 px-3 rounded-[8px] border border-[#e8e8e8] dark:border-[#222] bg-white dark:bg-[#141414] max-w-[260px] flex-1">
            <Search size={13} className="text-[#c0c0c0] dark:text-[#444] flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, phone, ID…"
              className="bg-transparent text-[13px] text-[#111] dark:text-[#e0e0e0] placeholder-[#c0c0c0] dark:placeholder-[#444] flex-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#141414] border border-[#ebebeb] dark:border-[#1e1e1e] rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-[#bbb] dark:text-[#444] text-sm">Loading tickets…</div>
          ) : error ? (
            <div className="p-6 text-red-500 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-[#bbb] dark:text-[#444] text-sm">No tickets found.</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#fafafa] dark:bg-[#111]">
                  {['Ticket ID', 'Customer', 'Device', 'Issues', 'Appointment', 'Assigned To', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-2.5 text-[10.5px] font-bold text-[#aaa] dark:text-[#444] uppercase tracking-widest border-b border-[#f0f0f0] dark:border-[#1e1e1e]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket, i) => (
                  <tr
                    key={ticket.ticketId}
                    onClick={() => setSelectedTicketId(ticket.ticketId)}
                    className={`hover:bg-[#fafafa] dark:hover:bg-[#111] transition-colors cursor-pointer ${
                      i !== filtered.length - 1 ? 'border-b border-[#f5f5f5] dark:border-[#1a1a1a]' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-[#aaa] dark:text-[#555]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                        #{ticket.ticketId}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-semibold text-[#111] dark:text-[#f0f0f0]">
                        {ticket.customer.name}
                      </p>
                      <a
                        href={`tel:${ticket.customer.phone.replace(/\D/g, '')}`}
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-[11px] text-[#6366f1] dark:text-[#818cf8] hover:underline w-fit mt-0.5"
                      >
                        <Phone size={10} />
                        {ticket.customer.phone}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-[#555] dark:text-[#aaa]">
                        {deviceLabel(ticket.device.type)}
                      </p>
                      <p className="text-[11px] text-[#bbb] dark:text-[#555]">
                        {[ticket.device.brand, ticket.device.modelCustom ?? ticket.device.modelTrim ?? ticket.device.modelNumber]
                          .filter(Boolean).join(' ')}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 max-w-[150px]">
                      <p className="text-[13px] text-[#555] dark:text-[#aaa] truncate">
                        {ticket.issues.join(', ')}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      {ticket.appointment.date ? (
                        <>
                          <p className="text-[13px] text-[#555] dark:text-[#aaa]">
                            {new Date(ticket.appointment.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-[11px] text-[#bbb] dark:text-[#555]">{ticket.appointment.timeSlot}</p>
                        </>
                      ) : (
                        <span className="text-[12px] text-[#ccc] dark:text-[#444]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 min-w-[120px]" onClick={e => e.stopPropagation()}>
                      <AssigneeCell ticketId={ticket.ticketId} value={ticket.assignedTo} />
                    </td>
                    <td className="px-5 py-3.5 min-w-[90px]" onClick={e => e.stopPropagation()}>
                      <StatusQuickUpdate
                        ticketId={ticket.ticketId}
                        status={ticket.status}
                        onUpdate={handleStatusChange}
                        disabled={updatingId === ticket.ticketId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
