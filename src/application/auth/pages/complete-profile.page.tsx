import {
  FormCard,
  FormCardHeader,
} from '@/application/_shared/components/molecules/form/form-card'
import { CompleteProfileForm } from '@/application/auth/components/complete-profile-form'

export function CompleteProfilePage() {
  return (
    <main className="linear-one flex min-h-screen w-full flex-col items-center justify-center px-6 lg:px-0">
      <section className="mx-auto flex w-full max-w-[900px] flex-col">
        <FormCard className="gap-8">
          <FormCardHeader
            title="Complete seu perfil"
            subtitle="Preencha os campos abaixo para completar seu perfil"
          />
          <CompleteProfileForm />
        </FormCard>
      </section>
    </main>
  )
}
