import { useState, useEffect, useCallback } from 'react'
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
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllTickets()
      setTickets(data)
    } catch {
      setError('Failed to load tickets.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  // Real-time: refetch whenever any row in tickets changes
  useEffect(() => {
    const channel = supabase
      .channel('tickets-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        () => fetchTickets()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchTickets])

  const updateStatus = useCallback(async (ticketId: string, status: TicketStatus) => {
    // Optimistic update
    setTickets(prev =>
      prev.map(t => t.ticketId === ticketId ? { ...t, status } : t)
    )
    try {
      await updateTicketStatus(ticketId, status)
    } catch {
      // Roll back on failure
      fetchTickets()
    }
  }, [fetchTickets])

  return { tickets, loading, error, updateStatus, refetch: fetchTickets }
}
