// adminApi.ts — Swap function bodies only when real backend is ready.
// Never change function signatures — components depend on them.

import type { Ticket, TicketStatus } from '../../ServicesSection/types/wizard'

const MOCK_TICKETS: Ticket[] = [
  {
    ticketId: 'DCR-1042',
    createdAt: '2025-04-27T09:14:00Z',
    status: 'in_repair',
    device: { type: 'iphone', brand: 'Apple', modelNumber: 'A3293', modelTrim: 'Pro', modelCustom: null },
    issues: ['Screen Replacement'],
    appointment: { date: '2025-04-27', timeSlot: '10:00 AM' },
    customer: { name: 'Marcus T.', email: 'marcus.t@gmail.com', phone: '(530) 555-0101' },
    source: 'web',
  },
  {
    ticketId: 'DCR-1041',
    createdAt: '2025-04-26T14:30:00Z',
    status: 'ready',
    device: { type: 'android', brand: 'Samsung', modelNumber: 'S928U', modelTrim: 'Ultra', modelCustom: null },
    issues: ['Battery Replacement'],
    appointment: { date: '2025-04-26', timeSlot: '2:00 PM' },
    customer: { name: 'Sarah M.', email: 'sarah.m@email.com', phone: '(530) 555-0182' },
    source: 'web',
  },
  {
    ticketId: 'DCR-1040',
    createdAt: '2025-04-26T11:00:00Z',
    status: 'reviewing',
    device: { type: 'ipad', brand: 'Apple', modelNumber: 'A2588', modelTrim: null, modelCustom: 'iPad Air 5th Gen' },
    issues: ['Charging Port'],
    appointment: { date: '2025-04-26', timeSlot: '11:00 AM' },
    customer: { name: 'James K.', email: 'jamesk@ucdavis.edu', phone: '(530) 555-0245' },
    source: 'web',
  },
  {
    ticketId: 'DCR-1039',
    createdAt: '2025-04-25T16:45:00Z',
    status: 'received',
    device: { type: 'iphone', brand: 'Apple', modelNumber: 'A2633', modelTrim: null, modelCustom: null },
    issues: ['Camera Fix', 'Software Issue'],
    appointment: { date: null, timeSlot: null },
    customer: { name: 'Priya N.', email: 'priya.n@gmail.com', phone: '(530) 555-0317' },
    source: 'mobile',
  },
  {
    ticketId: 'DCR-1038',
    createdAt: '2025-04-24T10:00:00Z',
    status: 'completed',
    device: { type: 'android', brand: 'Google', modelNumber: 'G9BQD', modelTrim: null, modelCustom: 'Pixel 8' },
    issues: ['Screen Replacement'],
    appointment: { date: '2025-04-24', timeSlot: '10:00 AM' },
    customer: { name: 'Derek W.', email: 'd.ward@outlook.com', phone: '(530) 555-0428' },
    source: 'web',
  },
  {
    ticketId: 'DCR-1037',
    createdAt: '2025-04-23T13:20:00Z',
    status: 'in_repair',
    device: { type: 'android', brand: 'Samsung', modelNumber: 'A546B', modelTrim: null, modelCustom: 'Galaxy A54' },
    issues: ['Battery Replacement', 'Charging Port'],
    appointment: { date: '2025-04-23', timeSlot: '1:00 PM' },
    customer: { name: 'Lena H.', email: 'lena.h@yahoo.com', phone: '(530) 555-0539' },
    source: 'web',
  },
  {
    ticketId: 'DCR-1036',
    createdAt: '2025-04-22T09:30:00Z',
    status: 'ready',
    device: { type: 'iphone', brand: 'Apple', modelNumber: 'A2896', modelTrim: 'Plus', modelCustom: null },
    issues: ['Back Glass Replacement'],
    appointment: { date: '2025-04-22', timeSlot: '9:30 AM' },
    customer: { name: 'Tomás R.', email: 'tomas.r@gmail.com', phone: '(530) 555-0651' },
    source: 'mobile',
  },
  {
    ticketId: 'DCR-1035',
    createdAt: '2025-04-21T15:00:00Z',
    status: 'completed',
    device: { type: 'tablet', brand: 'Samsung', modelNumber: 'X916B', modelTrim: null, modelCustom: 'Galaxy Tab S9 Ultra' },
    issues: ['Screen Replacement'],
    appointment: { date: '2025-04-21', timeSlot: '3:00 PM' },
    customer: { name: 'Aisha B.', email: 'aisha.b@email.com', phone: '(530) 555-0762' },
    source: 'web',
  },
]

export async function getAllTickets(): Promise<Ticket[]> {
  await new Promise(r => setTimeout(r, 800))
  return MOCK_TICKETS
}

export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  await new Promise(r => setTimeout(r, 400))
  return MOCK_TICKETS.find(t => t.ticketId === ticketId) ?? null
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<{ success: boolean }> {
  await new Promise(r => setTimeout(r, 400))
  return { success: true }
}