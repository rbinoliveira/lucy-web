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
  email: string
  cpf?: string | null
  susNumber?: string | null
  address?: {
    street?: string | null
    number?: string | null
    complement?: string | null
    neighborhood?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
  }
  photo?: string | null
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
