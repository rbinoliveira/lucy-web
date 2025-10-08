export type PrescriptionModel = {
  phone: string
  name: string
  id: string
  photo?: string
  role: 'prescription'
  dob: Date
  ownerId: string
  email: string
}
