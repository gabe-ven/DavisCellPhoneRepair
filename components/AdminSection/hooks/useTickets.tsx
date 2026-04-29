import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllTickets, updateTicketStatus, supabase } from '../api/adminApi'
import type { Ticket, TicketStatus } from '../types/admin'

interface UseTicketsReturn {
  tickets: Ticket[]
  loading: boolean
  error: string | null
  updateStatus: (ticketId: string, status: TicketStatus) => Promise<void>
  refetch: () => void
}

export function useTickets(): UseTicketsReturn {
  const [tickets, setTickets]   = useState<Ticket[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const initialLoadDone         = useRef(false)

  // `silent` = background refresh (no spinner, no table flash)
  const fetchTickets = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const data = await getAllTickets()
      setTickets(data)
    } catch {
      if (!silent) setError('Failed to load tickets.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Initial load — show spinner once
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true
      fetchTickets(false)
    }
  }, [fetchTickets])

  // Realtime — silent background sync, never shows spinner
  useEffect(() => {
    const channel = supabase
      .channel(`tickets-realtime-${Math.random()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        () => fetchTickets(true)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchTickets])

  const updateStatus = useCallback(async (ticketId: string, status: TicketStatus) => {
    // Optimistic update — instant UI, no flicker
    setTickets(prev => prev.map(t => t.ticketId === ticketId ? { ...t, status } : t))
    try {
      await updateTicketStatus(ticketId, status)
    } catch {
      fetchTickets(true) // silent rollback
    }
  }, [fetchTickets])

  return { tickets, loading, error, updateStatus, refetch: () => fetchTickets(false) }
}
