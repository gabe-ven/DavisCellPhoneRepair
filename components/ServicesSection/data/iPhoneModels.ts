import type { IPhoneModel } from '../types/wizard'

export const iPhoneModels: IPhoneModel[] = [
  { number: 'iPhone 17', trims: ['Pro Max', 'Pro', 'Air', null] },
  { number: 'iPhone 16', trims: ['Pro Max', 'Pro', 'Plus', null] },
  { number: 'iPhone 15', trims: ['Pro Max', 'Pro', 'Plus', null] },
  { number: 'iPhone 14', trims: ['Pro Max', 'Pro', 'Plus', null] },
  { number: 'iPhone 13', trims: ['Pro Max', 'Pro', 'Mini', null] },
  { number: 'iPhone 12', trims: ['Pro Max', 'Pro', 'Mini', null] },
  { number: 'iPhone 11', trims: ['Pro Max', 'Pro', null] },
  { number: 'iPhone XS', trims: ['Max', null] },
  { number: 'iPhone XR', trims: [null] },
  { number: 'iPhone X',  trims: [null] },
  { number: 'iPhone 8',  trims: ['Plus', null] },
  { number: 'iPhone 7',  trims: ['Plus', null] },
  { number: 'iPhone 6s', trims: ['Plus', null] },
  { number: 'iPhone 6',  trims: ['Plus', null] },
  { number: 'iPhone SE', trims: ['4th gen', '3rd gen', '2nd gen', '1st gen'] },
]

export function isValidIPhoneCombo(number: string, trim: string | null): boolean {
  const model = iPhoneModels.find(m => m.number === number)
  if (!model) return false
  return model.trims.includes(trim)
}

export function iPhoneNeedsTrim(number: string): boolean {
  const model = iPhoneModels.find(m => m.number === number)
  if (!model) return false
  // Needs trim if there's more than one option OR if the only option is not null
  return model.trims.length > 1 || model.trims[0] !== null
}

export function getIPhoneTrims(number: string): (string | null)[] {
  const model = iPhoneModels.find(m => m.number === number)
  return model ? model.trims : []
}