// adminApi.ts — Real Supabase implementation.
// Never change function signatures — components depend on them.

import { createBrowserClient } from '@supabase/ssr'
import type { Ticket, TicketStatus } from '../../ServicesSection/types/wizard'

// Uses the SSR browser client so the admin's login session cookie is
// automatically forwarded — required when RLS is enabled on the tickets table.
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function rowToTicket(row: Record<string, unknown>): Ticket {
  return {
    ticketId:  row.id as string,
    createdAt: row.created_at as string,
    status:    row.status as TicketStatus,
    device: {
      type:        row.device_type as Ticket['device']['type'],
      brand:       row.brand as string | null,
      modelNumber: row.model_number as string | null,
      modelTrim:   row.model_trim as string | null,
      modelCustom: row.model_custom as string | null,
    },
    issues:   (row.issues as string[]) ?? [],
    images:   (row.images as Ticket['images']) ?? [],
    appointment: {
      date:     row.appointment_date as string | null,
      timeSlot: row.appointment_time as string | null,
    },
    customer: {
      name:  row.customer_name as string,
      email: row.customer_email as string,
      phone: row.customer_phone as string,
    },
    source:     (row.source as Ticket['source']) ?? 'web',
    assignedTo: (row.assigned_to as string | null) ?? null,
    notes:      (row.notes as string | null) ?? null,
  }
}

export async function getAllTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToTicket)
}

export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', ticketId)
    .single()

  if (error || !data) return null
  return rowToTicket(data)
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
  return { success: true }
}

export async function updateAssignedTo(
  ticketId: string,
  assignedTo: string | null
): Promise<void> {
  const { error } = await supabase
    .from('tickets')
    .update({ assigned_to: assignedTo || null })
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
}

export async function updateNotes(
  ticketId: string,
  notes: string | null
): Promise<void> {
  const { error } = await supabase
    .from('tickets')
    .update({ notes: notes || null })
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
}

// Expose the supabase client so useTickets can subscribe to real-time changes
export { supabase }
