/* eslint-disable react/no-unknown-property */
import '@/application/_shared/styles/globals.css'
import 'react-datepicker/dist/react-datepicker.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { RootProviders } from '@/application/_shared/providers/root.provider'

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--inter',
})

export const metadata: Metadata = {
  title: 'Create Next App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.className} antialiased`}>
      <body cz-shortcut-listen="true">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
