import { PillBottle, Smartphone, Users } from 'lucide-react'

import { cn } from '@/shared/libs/tw-merge'

export function LoginInformations() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        <div className="h-[68px] w-[58px] rounded-2xl bg-[#3382d2]" />
        <div className="flex flex-col">
          <h1 className="text-[1.875rem] leading-[1.2] font-bold text-white">
            Lucy
          </h1>
          <p className="text-text-five leading-[1.5]">
            Sistema de Prescrições Médicas
          </p>
        </div>
      </div>
      <h2 className="mt-8 text-4xl leading-[1.25] font-bold text-white">
        Revolucione sua prática odontológica
      </h2>
      <p className="text-text-five mt-6 text-xl leading-[1.4]">
        Gerencie prescrições digitais de forma segura e conecte-se
        automaticamente com seus pacientes
      </p>
      <div className="mt-8 flex flex-col gap-6">
        <LoginInformationsCard
          title="Gestão Completa de Pacientes"
          description="Organize e acesse históricos médicos"
          icon={<Users className="text-white" />}
          color="green"
        />
        <LoginInformationsCard
          title="Prescrições Digitais Inteligentes"
          description="Autocomplete e validações automáticas"
          icon={<PillBottle className="text-white" />}
          color="blue"
        />
        <LoginInformationsCard
          title="Sincronização Automática"
          description="Conecte-se com o app do paciente em tempo real"
          icon={<Smartphone className="text-white" />}
          color="yellow"
        />
      </div>
    </div>
  )
}

function LoginInformationsCard({
  title,
  description,
  icon,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: 'green' | 'blue' | 'yellow'
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl bg-white/25 p-4',
        'border border-white/18',
      )}
    >
      <div
        className={cn('flex h-12 w-12 items-center justify-center rounded-lg', {
          'bg-green-one': color === 'green',
          'bg-primary': color === 'blue',
          'bg-yellow-one': color === 'yellow',
        })}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg leading-[1.55] font-semibold text-white">
          {title}
        </h3>
        <p className="text-text-five text-sm leading-[1.42]">{description}</p>
      </div>
    </div>
  )
}
