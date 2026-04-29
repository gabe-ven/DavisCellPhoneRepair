import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.ticketId || !body?.contact) {
    return NextResponse.json({ found: false })
  }

  const id = String(body.ticketId).trim().toUpperCase()
  const rawContact = String(body.contact).trim()

  const { data } = await supabase
    .from('tickets')
    .select(
      'id, status, device_type, brand, model_number, model_trim, model_custom, issues, assigned_to, created_at, appointment_date, customer_name, customer_email, customer_phone'
    )
    .eq('id', id)
    .maybeSingle()

  // Return identical response for "not found" and "wrong contact" — prevents enumeration
  if (!data) return NextResponse.json({ found: false })

  const storedEmail = (data.customer_email ?? '').toLowerCase()
  const storedDigits = (data.customer_phone ?? '').replace(/\D/g, '')
  const isEmail = rawContact.includes('@')
  const inputEmail = rawContact.toLowerCase()
  const inputDigits = rawContact.replace(/\D/g, '')

  const emailMatch = isEmail && storedEmail === inputEmail
  const phoneMatch = !isEmail && inputDigits.length >= 7 && storedDigits.endsWith(inputDigits.slice(-7))

  if (!emailMatch && !phoneMatch) {
    return NextResponse.json({ found: false })
  }

  return NextResponse.json({
    found: true,
    ticket: {
      id: data.id,
      status: data.status,
      deviceType: data.device_type,
      brand: data.brand,
      modelNumber: data.model_number,
      modelTrim: data.model_trim,
      modelCustom: data.model_custom,
      issues: (data.issues as string[]) ?? [],
      assignedTo: (data.assigned_to as string | null) ?? null,
      createdAt: data.created_at,
      appointmentDate: data.appointment_date,
      customerName: (data.customer_name as string | null) ?? null,
    },
  })
}
