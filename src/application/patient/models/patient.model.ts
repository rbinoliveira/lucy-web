export type Gender = 'male' | 'female' | 'other'

export const genderLabels: Record<Gender, string> = {
  male: 'Masculino',
  female: 'Feminino',
  other: 'Outro',
}

export type PatientModel = {
  id: string
  name: string
  nameNormalized: string
  phone: string
  phoneNormalized: string
  dob: Date
  gender: Gender
  role: 'patient'
  ownerId: string
  email?: string
  cpf?: string
  susNumber?: string
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
  }
  photo?: string
  createdAt?: Date
  updatedAt?: Date
}

export function calculateAge(dob: Date): number {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}

export function formatAge(dob: Date): string {
  const age = calculateAge(dob)
  return `${age} ${age === 1 ? 'ano' : 'anos'}`
}
