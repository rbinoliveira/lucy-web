export type UserStatus = 'pending' | 'approved' | 'rejected'

export type UserModel = {
  id: string
  email: string
  name: string
  role: 'admin' | 'dentist' | 'patient'
  photo?: string | null
  cro?: string | null
  phone?: string | null
  status?: UserStatus
}
