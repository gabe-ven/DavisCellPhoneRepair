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

  const ticketId = `MFC-${Date.now()}`

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
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await resend.emails.send({
    from:    'Davis Cell Phone Repair <onboarding@resend.dev>',
    to:      state.customer.email,
    subject: `Your repair ticket ${ticketId}`,
    html: `
      <h2>We got your repair request!</h2>
      <p>Hi ${state.customer.name},</p>
      <p>Your ticket number is <strong>${ticketId}</strong>.</p>
      <p>We'll confirm your appointment for <strong>${state.appointment.date} at ${state.appointment.timeSlot}</strong> shortly.</p>
      <p>Questions? Call us: <a href="tel:+15303413384">(530) 341-3384</a></p>
      <p>— Davis Cell Phone Repair</p>
    `,
  })

  return NextResponse.json({ ticketId })
}
