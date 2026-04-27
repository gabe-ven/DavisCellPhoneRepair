import { TimeSlot } from '../types/wizard'

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6
// 0 = Sunday, 1 = Monday, ..., 6 = Saturday

const WEEKDAY_SLOTS: TimeSlot[] = [
  { label: '10:00 AM', available: true },
  { label: '11:00 AM', available: true },
  { label: '12:00 PM', available: true },
  { label: '1:00 PM',  available: true },
  { label: '2:00 PM',  available: true },
  { label: '3:00 PM',  available: true },
  { label: '4:00 PM',  available: true },
  { label: '5:00 PM',  available: true },
  { label: '6:00 PM',  available: true },
]

const SATURDAY_SLOTS: TimeSlot[] = [
  { label: '10:00 AM', available: true },
  { label: '11:00 AM', available: true },
  { label: '12:00 PM', available: true },
  { label: '1:00 PM',  available: true },
  { label: '2:00 PM',  available: true },
  { label: '3:00 PM',  available: true },
  { label: '4:00 PM',  available: true },
  { label: '5:00 PM',  available: true },
  { label: '6:00 PM',  available: true },
]

const SUNDAY_SLOTS: TimeSlot[] = [
  { label: '10:00 AM', available: true },
  { label: '11:00 AM', available: true },
  { label: '12:00 PM', available: true },
  { label: '1:00 PM',  available: true },
  { label: '2:00 PM',  available: true },
  { label: '3:00 PM',  available: true },
  { label: '4:00 PM',  available: true },
]

/**
 * Returns time slots for a given date string (ISO format: YYYY-MM-DD).
 * Uses the day of week to determine correct hours:
 *   Monday–Saturday: 10 AM – 6 PM
 *   Sunday:          10 AM – 4 PM
 */
export function getSlotsForDate(dateString: string): TimeSlot[] {
  const date = new Date(dateString + 'T12:00:00') // noon to avoid timezone offset issues
  const day = date.getDay() as DayOfWeek

  if (day === 0) return SUNDAY_SLOTS
  if (day === 6) return SATURDAY_SLOTS
  return WEEKDAY_SLOTS
}

export function getHoursLabel(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00')
  const day = date.getDay()
  if (day === 0) return '10 AM – 4 PM'
  return '10 AM – 6 PM'
}