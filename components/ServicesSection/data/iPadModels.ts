import type { IPadModel } from '../types/wizard'

export const iPadModels: IPadModel[] = [
  { number: 'iPad Pro 13-inch', trims: ['M4', 'M2'] },
  { number: 'iPad Pro 11-inch', trims: ['M4', 'M2', 'M1'] },
  { number: 'iPad Air 13-inch', trims: ['M3', 'M2'] },
  { number: 'iPad Air 11-inch', trims: ['M3', 'M2'] },
  { number: 'iPad mini',        trims: ['A17 Pro', '6th gen'] },
  { number: 'iPad',             trims: ['10th gen', '9th gen', '8th gen'] },
]

export function getIPadTrims(number: string): string[] {
  const model = iPadModels.find(m => m.number === number)
  return model ? model.trims : []
}

export function isValidIPadCombo(number: string, trim: string): boolean {
  const model = iPadModels.find(m => m.number === number)
  if (!model) return false
  return model.trims.includes(trim)
}