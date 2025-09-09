import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pill Reminder',
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="linear-bg-one flex min-h-screen w-full flex-col md:flex-row">
      <div className="px-6 lg:px-0 w-full items-center max-w-[1200px] mx-auto flex">
        {children}
      </div>
    </main>
  )
}
