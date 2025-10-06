import { CalendarDate } from '@internationalized/date'
import { differenceInYears } from 'date-fns'

export function convertToNumberDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const formatted = `${day}${month}${year}`

  return formatted
} // output 30062025

export function convertToDateString(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const formatted = `${day}/${month}/${year}`

  return formatted
} // output 30/06/2025

export function getDifferenceInYears(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date)
  }

  return differenceInYears(new Date(), date)
} // 30

export function isDateValid(date: Date) {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

export function toNativeDate(dateValue: CalendarDate | null): Date | null {
  if (!dateValue) return null
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

export function toCalendarDate(date: Date | string): CalendarDate {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  )
}
