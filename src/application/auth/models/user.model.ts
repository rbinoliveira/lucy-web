export type UserStatus = 'pending' | 'approved' | 'rejected'

export type UserModel = {
  id: string
  email: string
  name: string
  role: string
  photo?: string
  cro?: string
  phone?: string
  status?: UserStatus
}
