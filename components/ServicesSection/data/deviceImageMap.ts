export const deviceImageMap: Record<string, string> = {
  // iPhone 17
  'iPhone 17 Pro Max': '/images/devices/iphone-17-pro-max.png',
  'iPhone 17 Pro':     '/images/devices/iphone-17-pro.png',
  'iPhone 17 Air':     '/images/devices/iphone-17-air.png',
  'iPhone 17':         '/images/devices/iphone-17.png',
  // iPhone 16
  'iPhone 16 Pro Max': '/images/devices/iphone-16-pro-max.png',
  'iPhone 16 Pro':     '/images/devices/iphone-16-pro.png',
  'iPhone 16 Plus':    '/images/devices/iphone-16-plus.png',
  'iPhone 16':         '/images/devices/iphone-16.png',
  // iPhone 15
  'iPhone 15 Pro Max': '/images/devices/iphone-15-pro-max.png',
  'iPhone 15 Pro':     '/images/devices/iphone-15-pro.png',
  'iPhone 15 Plus':    '/images/devices/iphone-15-plus.png',
  'iPhone 15':         '/images/devices/iphone-15.png',
  // Older models follow same pattern — add as needed
}

export function getDeviceImageKey(number: string, trim: string | null): string {
  return trim ? `${number} ${trim}` : number
}

export function getDeviceImage(number: string, trim: string | null): string {
  const key = getDeviceImageKey(number, trim)
  return deviceImageMap[key] ?? '/images/devices/placeholder.png'
}