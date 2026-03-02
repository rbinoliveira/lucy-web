import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lucy',
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="linear-one flex min-h-screen w-full flex-col md:flex-row">
      <div className="mx-auto flex w-full max-w-[1200px] items-center px-6 lg:px-0">
        {children}
      </div>
    </main>
  )
}
