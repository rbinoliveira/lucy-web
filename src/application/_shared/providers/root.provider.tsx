'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { I18nProvider } from 'react-aria-components'

import { Toaster } from '@/application/_shared/components/atoms/sonner'
import { Dialog } from '@/application/_shared/components/molecules/dialog'
import { DialogProvider } from '@/application/_shared/hooks/dialog.hook'
import { TableProvider } from '@/application/_shared/hooks/table.hook'
import { queryClient } from '@/application/_shared/libs/react-query'
import { AuthProvider } from '@/application/auth/hooks/auth.hook'

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nProvider locale="pt-BR">
          <DialogProvider>
            <TableProvider>
              {children}
              <Toaster />
              <Dialog />
            </TableProvider>
          </DialogProvider>
        </I18nProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
