export function generateInitials(name?: string): string {
  if (!name) return ''

  const words = name.trim().split(/\s+/)
  const initials = words.map((word) => word[0].toUpperCase())

  if (initials.length === 1) return initials[0]
  if (initials.length === 2) return initials.join('')
  return initials[0] + initials[initials.length - 1]
}

export function getCompoundName(name?: string): string {
  if (!name) return ''

  const words = name.trim().split(/\s+/)

  if (words.length === 1) return words[0]
  if (words.length === 2) return words.join(' ')
  return words[0] + ' ' + words[words.length - 1]
}
