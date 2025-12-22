import { remove as removeAccents } from 'diacritics'

export function normalizeName(name: string): string {
  if (!name) return ''
  return removeAccents(name.trim().toLowerCase())
}

export function normalizePhone(phone: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}
