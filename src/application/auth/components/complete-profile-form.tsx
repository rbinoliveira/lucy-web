'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/application/_shared/components/atoms/button'
import { FormCardFooter } from '@/application/_shared/components/molecules/form/form-card'
import { InputMaskedText } from '@/application/_shared/components/molecules/form/input-masked-text'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import { appRoutes } from '@/application/_shared/constants/app-routes.constant'
import { addAuthCookies } from '@/application/_shared/helpers/add-auth-cookies.helper'
import { handleError } from '@/application/_shared/helpers/error.helper'
import { upsertDocument } from '@/application/_shared/services/shared.service'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import { UserSchema, userSchema } from '@/application/auth/schemas/user.schema'

export function CompleteProfileForm() {
  const { user } = useAuth()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
  })

  const router = useRouter()

  async function onSubmit(data: UserSchema) {
    try {
      if (!user?.id) return
      await upsertDocument('users', user.id, data)
      await addAuthCookies({
        user: { ...data, id: user.id, photo: user.photo },
      })
      toast('Success', {
        description: 'Perfil atualizado com sucesso',
      })
      router.push(appRoutes.dashboard)
    } catch (err) {
      handleError({ err })
    }
  }

  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  return (
    <form className="flex flex-col gap-4">
      <input type="hidden" {...register('email')} />
      <input type="hidden" {...register('role')} />
      <InputText
        label="Nome"
        control={control}
        name="name"
        placeholder="Dr. Exemplo"
        disabled={Boolean(user?.name)}
      />
      <InputMaskedText
        label="CRO"
        control={control}
        name="cro"
        mask="only-numbers"
      />
      <InputMaskedText
        label="Telefone"
        control={control}
        name="phone"
        mask="phone"
      />
      <FormCardFooter className="mt-4">
        <Button
          variant="primary"
          className="max-w-[238px]"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          <Check strokeWidth={2} size={18} />
          Completar
        </Button>
      </FormCardFooter>
    </form>
  )
}
