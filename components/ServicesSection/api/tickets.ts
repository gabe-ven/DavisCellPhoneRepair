import type { WizardState, Ticket } from '../types/wizard'

export async function submitTicket(state: WizardState): Promise<{ ticketId: string }> {
  const res = await fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? 'Failed to submit ticket')
  }
  return res.json()
}

export async function lookupTicket(ticketId: string, email: string): Promise<Ticket | null> {
  const res = await fetch(`/api/tickets/${ticketId}?email=${encodeURIComponent(email)}`)
  if (!res.ok) return null
  return res.json()
}

export async function requestQuote(state: WizardState): Promise<{ success: boolean }> {
  await submitTicket(state)
  return { success: true }
}
