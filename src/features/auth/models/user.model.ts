export type UserModel = {
  id: string
  email: string
  name: string
  role: 'admin' | 'dentist' | 'patient'
  photo: string | null
  cro?: string | null
  phone?: string | null
  isActive: boolean
  deletedAt?: Date | null
}
