import type { Metadata } from 'next'

import {
  AppSidebar,
  AppSidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/application/_shared/components/organisms/sidebar/sidebar'

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
      <AppSidebar />
      <SidebarInset className="flex w-full flex-col">
        <AppSidebarHeader />
        <main className="mx-auto w-full max-w-[1200px] px-6 py-6 2xl:px-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
