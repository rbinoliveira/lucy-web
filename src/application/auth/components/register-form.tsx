'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { UI } from '@/application/_shared/components'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import {
  RegisterSchema,
  registerSchema,
} from '@/application/auth/schemas/register.schema'

export function RegisterForm() {
  const { control, handleSubmit } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const { signInWithGoogle, registerWithCredentials } = useAuth()

  async function handleRegisterWithCredentials(data: RegisterSchema) {
    registerWithCredentials(data)
  }

  return (
    <form
      className="flex w-full flex-col gap-4 bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      onSubmit={handleSubmit(handleRegisterWithCredentials)}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-[1.875rem] leading-[1.2] font-bold">
          Cadastre-se!
        </h1>
        <p className="text-text-two text-center leading-[1.5]">
          Informe seus dados para se cadastrar
        </p>
      </div>
      <UI.Button variant="google" className="mt-2" onClick={signInWithGoogle}>
        <UI.Image
          src={'/google.svg'}
          alt="Ícone do google"
          className="w-[24px] h-[24px]"
        />
        Cadastre-se com Google
        <UI.Image
          src={'/arrow-right.svg'}
          alt="Ícone do google"
          className="w-[18px] h-[18px]"
        />
      </UI.Button>
      <UI.Separator label="ou cadastre-se com e-mail" />
      <UI.InputText
        label="Nome"
        control={control}
        name="name"
        placeholder="Dr. Exemplo"
      />
      <UI.InputText
        label="E-mail"
        control={control}
        name="email"
        placeholder="dr.exemplo@clinica.com"
      />
      <div className="grid grid-cols-2 items-center gap-2">
        <UI.InputText
          label="Senha"
          control={control}
          name="password"
          placeholder="Digite sua senha"
          type="password"
        />
        <UI.InputText
          label="Confirme a senha"
          control={control}
          name="confirmPassword"
          placeholder="Digite sua senha"
          type="password"
        />
      </div>
      <UI.Button variant="login" type="submit" className="mt-2">
        <UI.Image
          src={'/login.svg'}
          alt="Ícone de entrar"
          className="w-[16px] h-[16px]"
        />
        Cadastrar
      </UI.Button>

      <div className="inline-flex items-center self-center mt-2 gap-1">
        <span className="text-sm text-text-two">Já possui uma conta?</span>
        <UI.Button variant="link" asChild>
          <Link href="/">Acesse sua conta</Link>
        </UI.Button>
      </div>
    </form>
  )
}
