export function convertToNumberDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const formatted = `${day}${month}${year}`

  return formatted
} // output 30062025

export function isDateValid(date: Date) {
  return date instanceof Date && !Number.isNaN(date.getTime())
}
