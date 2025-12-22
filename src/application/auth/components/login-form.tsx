'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { Button } from '@/application/_shared/components/atoms/button'
import { Separator } from '@/application/_shared/components/atoms/separator'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import { Image } from '@/application/_shared/components/molecules/image'
import {
  LoginSchema,
  loginSchema,
} from '@/application/auth/schemas/login.schema'
import {
  signInWithCredentials,
  signInWithGoogle,
} from '@/application/auth/services/auth-firebase.service'

export function LoginForm() {
  const { control, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  async function handleCreateSession(data: LoginSchema) {
    signInWithCredentials(data)
  }

  return (
    <form
      className="flex w-full flex-col gap-4 bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
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
        <Image
          src={'/google.svg'}
          alt="Ícone do google"
          className="w-[24px] h-[24px]"
        />
        Continuar com Google
        <Image
          src={'/arrow-right.svg'}
          alt="Ícone do google"
          className="w-[18px] h-[18px]"
        />
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
      <Button variant="login" type="submit">
        <Image
          src={'/login.svg'}
          alt="Ícone de entrar"
          className="w-[16px] h-[16px]"
        />
        Acessar Sistema
      </Button>

      <div className="inline-flex items-center self-center mt-2 gap-1">
        <span className="text-sm text-text-two">Primeiro acesso?</span>
        <Button variant="link" asChild>
          <Link href="/registrar">Crie sua conta</Link>
        </Button>
      </div>
    </form>
  )
}
