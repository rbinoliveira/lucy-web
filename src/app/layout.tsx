import '@/shared/styles/globals.css'
import 'react-datepicker/dist/react-datepicker.css'

import type { Metadata } from 'next'
import { Outfit, Space_Mono as SpaceMono } from 'next/font/google'

import { RootProviders } from '@/shared/providers/root.provider'

const outfit = Outfit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-outfit',
})

const spaceMono = SpaceMono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  title: 'Lucy',
  description: 'Sistema de prescrições para dentistas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${spaceMono.variable} antialiased`}
    >
      <body suppressHydrationWarning className={outfit.className}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
