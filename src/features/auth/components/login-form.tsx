'use client'

import { ArrowRight, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { LoginSchema, loginSchema } from '@/features/auth/schemas/login.schema'
import {
  signInWithCredentials,
  signInWithGoogle,
} from '@/features/auth/services/auth-firebase.service'
import { Button } from '@/shared/components/button'
import { InputText } from '@/shared/components/input-text'
import { Separator } from '@/shared/components/separator'
import { zodResolver } from '@/shared/libs/zod-resolver'

export function LoginForm() {
  const { control, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  async function handleCreateSession(data: LoginSchema) {
    signInWithCredentials(data)
  }

  return (
    <form
      className="flex w-full flex-col gap-4 rounded-3xl bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      onSubmit={handleSubmit(handleCreateSession)}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-[1.875rem] leading-[1.2] font-bold">
          Bem-vindo de volta!
        </h1>
        <p className="text-text-two text-center leading-[1.5]">
          Acesse sua conta para gerenciar prescrições
        </p>
      </div>
      <Button variant="google" className="mt-2" onClick={signInWithGoogle}>
        <svg
          className="h-[24px] w-[24px]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continuar com Google
        <ArrowRight className="h-[18px] w-[18px]" />
      </Button>
      <Separator label="ou continue com e-mail" />
      <InputText
        label="E-mail"
        control={control}
        name="email"
        placeholder="dr.exemplo@clinica.com"
        inputSize="lg"
      />
      <InputText
        label="Senha"
        control={control}
        name="password"
        placeholder="Digite sua senha segura"
        type="password"
        inputSize="lg"
      />
      <Button className="self-end" variant="link" asChild>
        <Link href="/recuperar-senha">Esqueci minha senha</Link>
      </Button>
      <Button
        variant="login"
        type="submit"
        icon={<LogIn className="h-[16px] w-[16px]" />}
      >
        Acessar Sistema
      </Button>

      <div className="mt-2 inline-flex items-center gap-1 self-center">
        <span className="text-text-two text-sm">Primeiro acesso?</span>
        <Button variant="link" asChild>
          <Link href="/registrar">Crie sua conta</Link>
        </Button>
      </div>
    </form>
  )
}
