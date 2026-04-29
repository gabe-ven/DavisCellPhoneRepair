'use client'

import { useState, useRef } from 'react'
import { X, Phone, Mail, UserRound, Calendar, Clock, Tag, Smartphone, FileText } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { updateAssignedTo, updateNotes } from '../api/adminApi'
import { deviceLabel } from '../utils/deviceLabel'
import { issueTypes } from '../../ServicesSection/data/issueTypes'
import type { Ticket, TicketStatus } from '../../ServicesSection/types/wizard'

const ISSUE_LABEL = Object.fromEntries(issueTypes.map(i => [i.id, i.label]))

const STATUS_OPTS: { value: TicketStatus; label: string; active: string; idle: string }[] = [
  { value: 'received',  label: 'Received',  active: 'bg-blue-500 border-blue-500 text-white',    idle: 'border-[#e5e7eb] dark:border-[#262626] text-[#374151] dark:text-[#9ca3af] hover:bg-[#f5f5f5] dark:hover:bg-[#222]' },
  { value: 'reviewing', label: 'Reviewing', active: 'bg-yellow-400 border-yellow-400 text-white', idle: 'border-[#e5e7eb] dark:border-[#262626] text-[#374151] dark:text-[#9ca3af] hover:bg-[#f5f5f5] dark:hover:bg-[#222]' },
  { value: 'in_repair', label: 'In Repair', active: 'bg-orange-500 border-orange-500 text-white', idle: 'border-[#e5e7eb] dark:border-[#262626] text-[#374151] dark:text-[#9ca3af] hover:bg-[#f5f5f5] dark:hover:bg-[#222]' },
  { value: 'ready',     label: 'Ready',     active: 'bg-green-500 border-green-500 text-white',  idle: 'border-[#e5e7eb] dark:border-[#262626] text-[#374151] dark:text-[#9ca3af] hover:bg-[#f5f5f5] dark:hover:bg-[#222]' },
  { value: 'completed', label: 'Completed', active: 'bg-[#737373] border-[#737373] text-white',  idle: 'border-[#e5e7eb] dark:border-[#262626] text-[#374151] dark:text-[#9ca3af] hover:bg-[#f5f5f5] dark:hover:bg-[#222]' },
]

const SECTION = 'px-6 py-5 border-b border-[#e5e7eb] dark:border-[#262626]'
const LABEL   = 'text-[10px] font-bold uppercase tracking-widest text-[#9ca3af] dark:text-[#737373] mb-2'
const VALUE   = 'text-[14px] text-[#111111] dark:text-[#f0f0f0]'

interface Props {
  ticket: Ticket
  onClose: () => void
  onStatusChange: (ticketId: string, status: TicketStatus) => void
}

function AssigneeEdit({ ticketId, value }: { ticketId: string; value: string | null | undefined }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() { setDraft(value ?? ''); setEditing(true); setTimeout(() => inputRef.current?.select(), 0) }
  async function save() {
    setEditing(false); setSaving(true)
    try { await updateAssignedTo(ticketId, draft.trim() || null) } catch { /* resync */ } finally { setSaving(false) }
  }
  function onKey(e: React.KeyboardEvent) { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }

  if (editing) {
    return (
      <input
        ref={inputRef} value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save} onKeyDown={onKey}
        placeholder="Technician name…"
        className="w-full px-2 py-1 text-[13px] rounded-lg border border-[#6366f1]/40 bg-white dark:bg-[#111] text-[#111] dark:text-[#f0f0f0] focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30"
      />
    )
  }
  return (
    <button onClick={startEdit} className="flex items-center gap-2 text-[14px] hover:opacity-75 transition-opacity cursor-pointer">
      <UserRound size={15} className="text-[#6366f1] flex-shrink-0" />
      <span className={value ? 'text-[#111111] dark:text-[#f0f0f0]' : 'text-[#9ca3af] italic'}>
        {saving ? '…' : (value || 'Click to assign')}
      </span>
    </button>
  )
}

function NotesEdit({ ticketId, value }: { ticketId: string; value: string | null | undefined }) {
  const [draft, setDraft] = useState(value ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    if (draft === (value ?? '')) return
    setSaving(true)
    try {
      await updateNotes(ticketId, draft.trim() || null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { /* resync via realtime */ } finally { setSaving(false) }
  }

  return (
    <div className="relative">
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        rows={4}
        placeholder="Add internal repair notes here… (auto-saves on blur)"
        className="w-full px-3 py-2.5 text-[13px] rounded-xl border border-[#e5e7eb] dark:border-[#262626] bg-[#f9f9f9] dark:bg-[#111] text-[#374151] dark:text-[#d4d4d4] placeholder-[#9ca3af] dark:placeholder-[#737373] focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/60 resize-none leading-relaxed"
      />
      <span className={`absolute bottom-2.5 right-3 text-[11px] transition-opacity ${saving || saved ? 'opacity-100' : 'opacity-0'}`}>
        {saving ? <span className="text-[#9ca3af]">Saving…</span> : <span className="text-green-500">Saved</span>}
      </span>
    </div>
  )
}

export default function TicketDetailPanel({ ticket, onClose, onStatusChange }: Props) {
  const [updating, setUpdating] = useState(false)

  async function handleStatus(status: TicketStatus) {
    if (updating || status === ticket.status) return
    setUpdating(true)
    await onStatusChange(ticket.ticketId, status)
    setUpdating(false)
  }

  const sourceLabel = ticket.source === 'walkin' ? 'Walk-In' : 'Web Booking'
  const createdDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-[420px] h-full bg-white dark:bg-[#1a1a1a] border-l border-[#e5e7eb] dark:border-[#262626] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1a1a] flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[#262626] z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[13px] text-[#9ca3af]">#{ticket.ticketId}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                ticket.source === 'walkin'
                  ? 'bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-950/30 dark:border-violet-800 dark:text-violet-300'
                  : 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300'
              }`}>{sourceLabel}</span>
            </div>
            <p className="text-[12px] text-[#9ca3af] dark:text-[#737373]">{createdDate}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e5e7eb] dark:border-[#262626] text-[#9ca3af] hover:text-[#374151] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Status */}
        <div className={SECTION}>
          <p className={LABEL}>Status</p>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_OPTS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleStatus(opt.value)}
                disabled={updating}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed ${
                  ticket.status === opt.value ? opt.active : opt.idle
                }`}
              >
                {ticket.status === opt.value && '✓ '}{opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer */}
        <div className={SECTION}>
          <p className={LABEL}>Customer</p>
          <p className="text-[18px] font-bold text-[#111111] dark:text-[#f5f5f5] mb-3">{ticket.customer.name}</p>
          <div className="flex flex-col gap-2">
            {ticket.customer.phone && (
              <a
                href={`tel:${ticket.customer.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-2.5 text-[14px] font-medium text-[#6366f1] dark:text-[#818cf8] hover:underline"
              >
                <Phone size={14} />
                {ticket.customer.phone}
              </a>
            )}
            {ticket.customer.email && (
              <a
                href={`mailto:${ticket.customer.email}`}
                className="flex items-center gap-2.5 text-[13px] text-[#6366f1] dark:text-[#818cf8] hover:opacity-75 transition-opacity"
              >
                <Mail size={14} />
                {ticket.customer.email}
              </a>
            )}
          </div>
        </div>

        {/* Device */}
        <div className={SECTION}>
          <p className={LABEL}>Device</p>
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={16} className="text-[#9ca3af] dark:text-[#737373]" />
            <span className={VALUE}>
              {deviceLabel(ticket.device.type)}
              {ticket.device.brand ? ` · ${ticket.device.brand}` : ''}
              {(ticket.device.modelCustom ?? ticket.device.modelTrim ?? ticket.device.modelNumber)
                ? ` — ${ticket.device.modelCustom ?? ticket.device.modelTrim ?? ticket.device.modelNumber}`
                : ''}
            </span>
          </div>

          <p className={`${LABEL} mt-1`}>Issues</p>
          <div className="flex flex-wrap gap-1.5">
            {ticket.issues.map(id => (
              <span
                key={id}
                className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-lg border border-[#e5e7eb] dark:border-[#262626] text-[#374151] dark:text-[#a3a3a3] bg-[#f9f9f9] dark:bg-[#111]"
              >
                <Tag size={10} />
                {ISSUE_LABEL[id] ?? id}
              </span>
            ))}
          </div>
        </div>

        {/* Appointment */}
        {(ticket.appointment.date || ticket.appointment.timeSlot) && (
          <div className={SECTION}>
            <p className={LABEL}>Appointment</p>
            <div className="flex items-center gap-4">
              {ticket.appointment.date && (
                <div className="flex items-center gap-2 text-[14px] text-[#374151] dark:text-[#a3a3a3]">
                  <Calendar size={14} />
                  {new Date(ticket.appointment.date + 'T12:00:00').toLocaleDateString('en-US', {
                    weekday: 'short', month: 'long', day: 'numeric',
                  })}
                </div>
              )}
              {ticket.appointment.timeSlot && (
                <div className="flex items-center gap-2 text-[14px] font-semibold text-[#111111] dark:text-[#f0f0f0]">
                  <Clock size={14} />
                  {ticket.appointment.timeSlot}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assigned To */}
        <div className={SECTION}>
          <p className={LABEL}>Assigned To</p>
          <AssigneeEdit ticketId={ticket.ticketId} value={ticket.assignedTo} />
        </div>

        {/* Repair Notes */}
        <div className={SECTION}>
          <p className={`${LABEL} flex items-center gap-1.5`}>
            <FileText size={10} />
            Repair Notes
          </p>
          <NotesEdit ticketId={ticket.ticketId} value={ticket.notes} />
        </div>

        {/* Images */}
        {ticket.images && ticket.images.length > 0 && (
          <div className={SECTION}>
            <p className={LABEL}>Photos ({ticket.images.length})</p>
            <div className="grid grid-cols-3 gap-2">
              {ticket.images.map((img) => (
                <img
                  key={img.id}
                  src={img.base64}
                  alt={img.name}
                  className="w-full aspect-square object-cover rounded-lg border border-[#e5e7eb] dark:border-[#262626]"
                />
              ))}
            </div>
          </div>
        )}

        {/* Metadata footer */}
        <div className="px-6 py-4 mt-auto">
          <div className="flex items-center justify-between text-[11px] text-[#9ca3af] dark:text-[#737373]">
            <span>ID: <span className="font-mono">{ticket.ticketId}</span></span>
            <StatusBadge status={ticket.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
