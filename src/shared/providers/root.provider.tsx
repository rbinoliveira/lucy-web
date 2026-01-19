'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { I18nProvider } from 'react-aria-components'

import { AuthProvider } from '@/features/auth/hooks/auth.hook'
import { Toaster } from '@/shared/components/atoms/sonner'
import { Dialog } from '@/shared/components/molecules/dialog'
import { DialogProvider } from '@/shared/hooks/dialog.hook'
import { TableProvider } from '@/shared/hooks/table.hook'
import { queryClient } from '@/shared/libs/react-query'

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
