// admin.ts — Admin-specific types.
// Import shared types from ServicesSection — never duplicate them.

import type { Ticket, TicketStatus } from '../../ServicesSection/types/wizard'

export type { Ticket, TicketStatus }

export interface TicketStats {
  total: number
  byStatus: Record<TicketStatus, number>
  todayAppointments: number
}