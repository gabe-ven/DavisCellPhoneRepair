import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import type { DeviceType } from '@/components/ServicesSection/types/wizard'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export interface AdminCreateTicketPayload {
  customerName:  string
  customerPhone: string
  customerEmail: string
  deviceType:    DeviceType | 'other'
  brand:         string
  model:         string
  issues:        string[]
  appointmentDate: string
  appointmentTime: string
  status:        string
  notes:         string
}

export async function POST(req: NextRequest) {
  // Verify the caller is an authenticated admin via session cookie
  const res = NextResponse.next()
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    }
  )
  const { data: { session } } = await authClient.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: AdminCreateTicketPayload = await req.json()

  const ticketId = `MFC-${Date.now()}`

  const { error } = await supabase.from('tickets').insert({
    id:               ticketId,
    status:           body.status || 'received',
    device_type:      body.deviceType === 'other' ? null : body.deviceType,
    brand:            body.brand  || null,
    model_custom:     body.model  || null,
    issues:           body.issues,
    appointment_date: body.appointmentDate || null,
    appointment_time: body.appointmentTime || null,
    customer_name:    body.customerName,
    customer_email:   body.customerEmail || '',
    customer_phone:   body.customerPhone,
    images:           [],
    source:           'walkin',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send confirmation email only if customer provided one
  if (body.customerEmail) {
    await resend.emails.send({
      from:    'Davis Cell Phone Repair <onboarding@resend.dev>',
      to:      body.customerEmail,
      subject: `Your repair ticket ${ticketId}`,
      html: `
        <h2>Your device is in good hands!</h2>
        <p>Hi ${body.customerName},</p>
        <p>We've created a repair ticket for your visit — your ticket number is <strong>${ticketId}</strong>.</p>
        ${body.appointmentDate ? `<p>Appointment: <strong>${body.appointmentDate} at ${body.appointmentTime}</strong></p>` : ''}
        <p>Questions? Call us: <a href="tel:+15303413384">(530) 341-3384</a></p>
        <p>— Davis Cell Phone Repair</p>
      `,
    })
  }

  return NextResponse.json({ ticketId })
}
