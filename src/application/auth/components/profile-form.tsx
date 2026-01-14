'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/application/_shared/components/atoms/button'
import { InputMaskedText } from '@/application/_shared/components/molecules/form/input-masked-text'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import { addAuthCookies } from '@/application/_shared/helpers/add-auth-cookies.helper'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import {
  ProfileSchema,
  profileSchema,
} from '@/application/auth/schemas/profile.schema'
import { upsertUser } from '@/application/auth/services/auth-firebase.service'

export function ProfileForm() {
  const { user, updateUser } = useAuth()
  const { control, handleSubmit, setValue } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('cro', user.cro || '')
      setValue('phone', user.phone || '')
    }
  }, [user, setValue])

  async function handleUpdateProfile(data: ProfileSchema) {
    if (!user) return

    try {
      const updatedUser = {
        ...user,
        ...data,
      }

      await upsertUser(user.id, updatedUser)
      await addAuthCookies({ user: updatedUser })
      updateUser(updatedUser)

      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
      console.error(error)
    }
  }

  return (
    <form
      className="flex w-full flex-col gap-4 bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-2xl mx-auto"
      onSubmit={handleSubmit(handleUpdateProfile)}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-text-two">Atualize suas informações pessoais</p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <InputText
          label="Nome"
          control={control}
          name="name"
          placeholder="Seu nome completo"
          inputSize="lg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputText
            label="CRO"
            control={control}
            name="cro"
            placeholder="Seu CRO"
            inputSize="lg"
          />
          <InputMaskedText
            label="Telefone"
            control={control}
            name="phone"
            mask="phone"
            placeholder="(00) 00000-0000"
            inputSize="lg"
          />
        </div>
      </div>

      <Button
        variant="primary"
        type="submit"
        className="mt-4 w-auto self-end px-8"
      >
        Salvar Alterações
      </Button>
    </form>
  )
}
