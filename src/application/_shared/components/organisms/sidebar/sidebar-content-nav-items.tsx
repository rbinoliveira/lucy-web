import { House, PillBottle, ScrollText, Users } from 'lucide-react'

import { SidebarContentNavItem } from '@/application/_shared/components/organisms/sidebar/sidebar-content-nav-item'

export const sidebarContentNavItems = (
  role?: string,
): SidebarContentNavItem[] => {
  const commonOptions = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <House />,
      description: 'Gerencie o dashboard',
    },
    {
      title: 'Pacientes',
      href: '/pacientes',
      icon: <Users />,
      description: 'Gerencie os pacientes e seus tratamentos',
    },
    {
      title: 'Prescrições',
      href: '/prescricoes',
      icon: <ScrollText />,
      description: 'Gerencie as prescrições',
    },
  ]

  const adminOptions = [
    {
      title: 'Medicamentos',
      href: '/medicamentos',
      icon: <PillBottle />,
      description: 'Gerencie os medicamentos',
    },
  ]

  return role === 'admin' ? [...commonOptions, ...adminOptions] : commonOptions
}
