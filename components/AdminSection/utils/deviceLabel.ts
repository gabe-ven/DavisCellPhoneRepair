const DEVICE_LABELS: Record<string, string> = {
  iphone:  'iPhone',
  ipad:    'iPad',
  android: 'Android',
  tablet:  'Tablet',
  other:   'Other',
}

export function deviceLabel(type: string | null | undefined): string {
  if (!type) return 'Unknown'
  return DEVICE_LABELS[type.toLowerCase()] ?? type
}
