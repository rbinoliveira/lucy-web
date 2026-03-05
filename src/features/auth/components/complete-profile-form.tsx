'use client'

import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { UserSchema, userSchema } from '@/features/auth/schemas/user.schema'
import { upsertUser } from '@/features/auth/services/auth-firebase.service'
import { Button } from '@/shared/components/button'
import { FormCardFooter } from '@/shared/components/form-card'
import { InputMaskedText } from '@/shared/components/input-masked-text'
import { InputText } from '@/shared/components/input-text'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { addAuthCookies } from '@/shared/helpers/add-auth-cookies.helper'
import { handleError } from '@/shared/helpers/error.helper'
import { zodResolver } from '@/shared/libs/zod-resolver'

export function CompleteProfileForm() {
  const { user, updateUser } = useAuth()
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
      const updatedUser = {
        ...data,
        id: user.id,
        photo: user.photo,
        isActive: user.isActive,
        deletedAt: user.deletedAt ?? null,
      }
      await upsertUser(user.id, updatedUser)
      await addAuthCookies({
        user: updatedUser,
      })
      updateUser(updatedUser)
      toast.success('Perfil atualizado com sucesso')
      router.push(appRoutes.dashboard)
    } catch (err) {
      handleError({ err })
    }
  }

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        cro: user.cro ?? '',
        phone: user.phone ?? '',
      })
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
