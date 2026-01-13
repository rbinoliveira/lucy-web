import { Metadata } from 'next'

import { ProfilePage } from '@/application/auth/pages/profile.page'

export const metadata: Metadata = {
  title: 'Meu Perfil | Pill Reminder',
}

export default function Perfil() {
  return <ProfilePage />
}
