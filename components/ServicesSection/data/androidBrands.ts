import type { AndroidBrand } from '../types/wizard'

export const androidBrands: AndroidBrand[] = [
  { id: 'samsung',  label: 'Samsung',  imagePath: '/images/brands/samsung.png',  placeholder: 'e.g. Galaxy S24, Galaxy A55, Galaxy Z Fold 6' },
  { id: 'google',   label: 'Google',   imagePath: '/images/brands/google.png',   placeholder: 'e.g. Pixel 9, Pixel 8 Pro, Pixel 7a' },
  { id: 'oneplus',  label: 'OnePlus',  imagePath: '/images/brands/oneplus.png',  placeholder: 'e.g. OnePlus 12, OnePlus Nord 4' },
  { id: 'motorola', label: 'Motorola', imagePath: '/images/brands/motorola.png', placeholder: 'e.g. Moto G Power, Edge 50 Pro' },
  { id: 'lg',       label: 'LG',       imagePath: '/images/brands/lg.png',       placeholder: 'e.g. LG V60, LG Velvet, LG G8' },
  { id: 'xiaomi',   label: 'Xiaomi',   imagePath: '/images/brands/xiaomi.png',   placeholder: 'e.g. Xiaomi 14, Redmi Note 13' },
  { id: 'huawei',   label: 'Huawei',   imagePath: '/images/brands/huawei.png',   placeholder: 'e.g. P60 Pro, Mate 60, Nova 12' },
  { id: 'other',    label: 'Other',    imagePath: '/images/brands/placeholder.png', placeholder: null },
]