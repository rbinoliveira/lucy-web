'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { Button } from '@/application/_shared/components/atoms/button'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import {
  RecoverPasswordSchema,
  recoverPasswordSchema,
} from '@/application/auth/schemas/recover-password.schema'
import { sendPasswordReset } from '@/application/auth/services/auth.service'

export function RecoverPasswordForm() {
  const { control, handleSubmit } = useForm<RecoverPasswordSchema>({
    resolver: zodResolver(recoverPasswordSchema),
  })

  async function handleRecoverPassword(data: RecoverPasswordSchema) {
    sendPasswordReset(data)
  }

  return (
    <form
      className="flex w-full flex-col gap-4 bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      onSubmit={handleSubmit(handleRecoverPassword)}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-[1.875rem] leading-[1.2] font-bold">
          Recuperar Senha
        </h1>
        <p className="text-text-two text-center leading-[1.5]">
          Informe seu e-mail para recuperar sua senha
        </p>
      </div>
      <InputText
        label="E-mail"
        control={control}
        name="email"
        placeholder="dr.exemplo@clinica.com"
        inputSize="lg"
      />
      <Button variant="login" type="submit" className="mt-2">
        <Send size={16} />
        Recuperar
      </Button>

      <div className="inline-flex items-center self-center mt-2 gap-1">
        <span className="text-sm text-text-two">Lembra sua senha?</span>
        <Button variant="link" asChild>
          <Link href="/">Voltar para login</Link>
        </Button>
      </div>
    </form>
  )
}
