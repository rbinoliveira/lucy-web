import {
  FormCard,
  FormCardHeader,
} from '@/application/_shared/components/molecules/form/form-card'
import { CompleteProfileForm } from '@/application/auth/components/complete-profile-form'

export function CompleteProfilePage() {
  return (
    <main className="linear-one px-6 lg:px-0 flex flex-col w-full min-h-screen items-center justify-center">
      <section className="flex flex-col w-full max-w-[900px] mx-auto">
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
