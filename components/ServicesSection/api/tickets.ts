import type { WizardState, Ticket } from '../types/wizard'

export async function submitTicket(state: WizardState): Promise<{ ticketId: string }> {
  await new Promise(r => setTimeout(r, 1000))
  return { ticketId: `MFC-${Date.now()}` }
}

export async function lookupTicket(ticketId: string, email: string): Promise<Ticket | null> {
  await new Promise(r => setTimeout(r, 800))
  // Suppress unused var warnings until real backend exists
  void ticketId
  void email
  return null
}

export async function requestQuote(state: WizardState): Promise<{ success: boolean }> {
  await new Promise(r => setTimeout(r, 800))
  void state
  return { success: true }
}