import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import type { WizardState } from '@/components/ServicesSection/types/wizard'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const state: WizardState = await req.json()

  // Rate limit: one submission per email per 2 hours
  const windowStart = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from('tickets')
    .select('id')
    .eq('customer_email', state.customer.email.toLowerCase().trim())
    .gte('created_at', windowStart)
    .limit(1)

  if (recent && recent.length > 0) {
    return NextResponse.json(
      { error: 'You already submitted a request in the last 2 hours. Check your email for your existing ticket, or call us at (530) 341-3384.' },
      { status: 429 }
    )
  }

  const ticketId = `DCR-${Date.now()}`

  const { error } = await supabase.from('tickets').insert({
    id:               ticketId,
    device_type:      state.device,
    brand:            state.brand,
    model_number:     state.modelNumber,
    model_trim:       state.modelTrim,
    model_custom:     state.modelCustom,
    issues:           state.issues,
    appointment_date: state.appointment.date,
    appointment_time: state.appointment.timeSlot,
    customer_name:    state.customer.name,
    customer_email:   state.customer.email,
    customer_phone:   state.customer.phone,
    images:           state.images,
    notes:            (state as { notes?: string }).notes ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Customer confirmation
  await resend.emails.send({
    from:    'Davis Cell Phone Repair <onboarding@resend.dev>',
    to:      state.customer.email,
    subject: `Your repair ticket ${ticketId}`,
    html: `
      <h2>We got your repair request!</h2>
      <p>Hi ${state.customer.name},</p>
      <p>Your ticket number is <strong>${ticketId}</strong>.</p>
      ${state.appointment.date
        ? `<p>Your preferred drop-off: <strong>${state.appointment.date} at ${state.appointment.timeSlot}</strong>. We'll confirm shortly.</p>`
        : `<p>You chose walk-in — come by anytime during shop hours (Mon–Sat 10AM–6PM, Sun 12PM–4PM).</p>`
      }
      <p>Questions? Call us: <a href="tel:+15303413384">(530) 341-3384</a></p>
      <p>— Davis Cell Phone Repair</p>
    `,
  })

  // Owner notification — swap to owner's real email before going live
  if (process.env.OWNER_EMAIL) {
    await resend.emails.send({
      from:    'Davis Cell Phone Repair <onboarding@resend.dev>',
      to:      process.env.OWNER_EMAIL,
      subject: `New repair request ${ticketId} — ${state.customer.name}`,
      html: `
        <h2>New ticket: ${ticketId}</h2>
        <p><strong>Customer:</strong> ${state.customer.name} · ${state.customer.phone} · ${state.customer.email}</p>
        <p><strong>Device:</strong> ${state.device} ${state.brand ?? ''} ${state.modelNumber ?? ''} ${state.modelTrim ?? ''} ${state.modelCustom ?? ''}</p>
        <p><strong>Issues:</strong> ${state.issues.join(', ')}</p>
        <p><strong>Appointment:</strong> ${state.appointment.date} at ${state.appointment.timeSlot}</p>
      `,
    })
  }

  return NextResponse.json({ ticketId })
}
