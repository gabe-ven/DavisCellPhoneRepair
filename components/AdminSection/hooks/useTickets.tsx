import { useState, useEffect, useCallback } from 'react'
import { getAllTickets, updateTicketStatus } from '../api/adminApi'
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
    } catch (e) {
      setError('Failed to load tickets.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const updateStatus = useCallback(async (ticketId: string, status: TicketStatus) => {
    // Optimistic update — roll back on error when real backend is wired
    setTickets(prev =>
      prev.map(t => t.ticketId === ticketId ? { ...t, status } : t)
    )
    try {
      await updateTicketStatus(ticketId, status)
    } catch {
      // TODO: rollback on real backend error
    }
  }, [])

  return { tickets, loading, error, updateStatus, refetch: fetchTickets }
}