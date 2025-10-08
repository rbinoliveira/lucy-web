import { SidebarContentNavItem } from '@/application/_shared/components/organisms/sidebar/sidebar-content-nav-item'
import { sidebarContentNavItems } from '@/application/_shared/components/organisms/sidebar/sidebar-content-nav-items'
import { useAuth } from '@/application/auth/hooks/auth.hook'

export function SidebarContentNav() {
  const { user } = useAuth()

  return (
    <nav>
      <ul className="flex flex-col gap-4 px-4">
        {sidebarContentNavItems(user?.role).map((item) => (
          <SidebarContentNavItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  )
}
