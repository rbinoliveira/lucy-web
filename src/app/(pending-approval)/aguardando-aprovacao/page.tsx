'use client'

import { Clock, LogOut } from 'lucide-react'

import { signOut } from '@/features/auth/services/auth-firebase.service'

export default function PendingApprovalPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-10 w-10 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Aguardando aprovação
          </h1>
          <p className="text-muted-foreground">
            Seu cadastro foi recebido com sucesso. Nossa equipe entrará em
            contato pelo telefone cadastrado para liberar seu acesso.
          </p>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-3 rounded-none border-t border-black/6 px-4 py-3 text-left text-sm font-medium text-text-two transition-colors hover:bg-primary/10 hover:text-danger-one hover:[&_svg]:text-danger-one [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-text-three"
        >
          <LogOut />
          Voltar para o login
        </button>
      </div>
    </main>
  )
}
