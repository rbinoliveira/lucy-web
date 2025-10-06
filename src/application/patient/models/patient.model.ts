export type PatientModel = {
  phone: string
  name: string
  id: string
  photo?: string
  role: 'patient'
  dob: Date
  ownerId: string
  email: string
}
