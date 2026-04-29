// types/wizard.ts

export type DeviceType = 'android' | 'iphone' | 'tablet' | 'ipad'

export interface IPhoneModel {
  number: string
  trims: (string | null)[]
}

export interface IPadModel {
  number: string
  trims: string[]
}

export interface AndroidBrand {
  id: string
  label: string
  imagePath: string
  placeholder: string | null
}

export interface IssueType {
  id: string
  label: string
  icon: string
}

export interface TimeSlot {
  label: string
  available: boolean
}

// Uploaded image — stored as base64 so no File lifetime issues and
// the payload is trivially JSON-serializable.
// To swap in a real upload endpoint later: replace fileToWizardImage()
// in QuoteStep only. This type and the state shape stay identical.
export interface WizardImage {
  id: string      // `${Date.now()}-${Math.random().toString(36).slice(2)}`
  name: string    // original filename
  type: string    // MIME type e.g. "image/jpeg"
  base64: string  // full data URL e.g. "data:image/jpeg;base64,..."
  sizeKb: number  // for display
}

export interface WizardState {
  step: number
  device: DeviceType | null
  brand: string | null
  modelNumber: string | null
  modelTrim: string | null
  modelCustom: string | null
  issues: string[]
  images: WizardImage[]           // max 5, base64-encoded
  appointment: {
    date: string | null
    timeSlot: string | null
  }
  customer: {
    name: string
    email: string
    phone: string
  }
  submittedTicketId: string | null
}

export type TicketStatus = 'received' | 'reviewing' | 'in_repair' | 'ready' | 'completed'

export interface Ticket {
  ticketId: string
  createdAt: string
  status: TicketStatus
  device: {
    type: DeviceType
    brand: string | null
    modelNumber: string | null
    modelTrim: string | null
    modelCustom: string | null
  }
  issues: string[]
  images: WizardImage[]
  appointment: { date: string | null; timeSlot: string | null }
  customer: { name: string; email: string; phone: string }
  source: 'web' | 'mobile' | 'walkin'
  assignedTo?: string | null
  notes?: string | null
}

export const initialWizardState: WizardState = {
  step: 0,
  device: null,
  brand: null,
  modelNumber: null,
  modelTrim: null,
  modelCustom: null,
  issues: [],
  images: [],
  appointment: {
    date: null,
    timeSlot: null,
  },
  customer: {
    name: '',
    email: '',
    phone: '',
  },
  submittedTicketId: null,
}