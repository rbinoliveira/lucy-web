import { CalendarDate } from '@internationalized/date'
import { differenceInYears } from 'date-fns'

export function convertToNumberDate(
  date:
    | Date
    | string
    | { toDate?: () => Date; seconds?: number; nanoseconds?: number }
    | null
    | undefined,
) {
  if (!date) {
    return ''
  }

  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else if (
    typeof date === 'object' &&
    'toDate' in date &&
    typeof date.toDate === 'function'
  ) {
    dateObj = date.toDate()
  } else if (
    typeof date === 'object' &&
    'seconds' in date &&
    typeof date.seconds === 'number'
  ) {
    dateObj = new Date(date.seconds * 1000)
  } else {
    dateObj = new Date(date as string | number)
  }

  if (!isDateValid(dateObj)) {
    return ''
  }

  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()

  const formatted = `${day}${month}${year}`

  return formatted
}

export function convertToDateString(
  date:
    | Date
    | string
    | { toDate?: () => Date; seconds?: number; nanoseconds?: number }
    | null
    | undefined,
) {
  if (!date) {
    return ''
  }

  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else if (
    typeof date === 'object' &&
    'toDate' in date &&
    typeof date.toDate === 'function'
  ) {
    dateObj = date.toDate()
  } else if (
    typeof date === 'object' &&
    'seconds' in date &&
    typeof date.seconds === 'number'
  ) {
    dateObj = new Date(date.seconds * 1000)
  } else {
    dateObj = new Date(date as string | number)
  }

  if (!isDateValid(dateObj)) {
    return ''
  }

  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()

  const formatted = `${day}/${month}/${year}`

  return formatted
}

export function getDifferenceInYears(
  date:
    | Date
    | string
    | { toDate?: () => Date; seconds?: number; nanoseconds?: number }
    | null
    | undefined,
) {
  if (!date) {
    return 0
  }

  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else if (
    typeof date === 'object' &&
    'toDate' in date &&
    typeof date.toDate === 'function'
  ) {
    dateObj = date.toDate()
  } else if (
    typeof date === 'object' &&
    'seconds' in date &&
    typeof date.seconds === 'number'
  ) {
    dateObj = new Date(date.seconds * 1000)
  } else {
    dateObj = new Date(date as string | number)
  }

  if (!isDateValid(dateObj)) {
    return 0
  }

  return differenceInYears(new Date(), dateObj)
}

export function isDateValid(date: Date) {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

export function toNativeDate(dateValue: CalendarDate | null): Date | null {
  if (!dateValue) return null
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

export function toCalendarDate(
  date:
    | Date
    | string
    | { toDate?: () => Date; seconds?: number; nanoseconds?: number }
    | null
    | undefined,
): CalendarDate {
  if (!date) {
    const today = new Date()
    return new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    )
  }

  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else if (
    typeof date === 'object' &&
    'toDate' in date &&
    typeof date.toDate === 'function'
  ) {
    dateObj = date.toDate()
  } else if (
    typeof date === 'object' &&
    'seconds' in date &&
    typeof date.seconds === 'number'
  ) {
    dateObj = new Date(date.seconds * 1000)
  } else {
    dateObj = new Date(date as string | number)
  }

  if (!isDateValid(dateObj)) {
    const today = new Date()
    return new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    )
  }

  return new CalendarDate(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    dateObj.getDate(),
  )
}
