import { Metadata } from 'next'

import { ProfilePage } from '@/features/auth/pages/profile.page'

export const metadata: Metadata = {
  title: 'Meu Perfil | Lucy',
}

export default function Perfil() {
  return <ProfilePage />
}
