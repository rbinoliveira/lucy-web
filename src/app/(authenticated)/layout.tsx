import type { Metadata } from 'next'

import {
  AppSidebar,
  AppSidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/shared/components/organisms/sidebar/sidebar'

export const metadata: Metadata = {
  title: 'Lucy',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="orb orb-1" aria-hidden />
      <div className="orb orb-2" aria-hidden />
      <div className="orb orb-3" aria-hidden />
      <AppSidebar />
      <SidebarInset className="flex w-full flex-col">
        <div className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-5 md:p-[30px]">
          <AppSidebarHeader />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
