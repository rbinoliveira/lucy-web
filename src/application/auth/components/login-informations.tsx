import { PillBottle, Smartphone, Users } from 'lucide-react'

import { cn } from '@/application/_shared/libs/tw-merge'

export function LoginInformations() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-4 items-center">
        <div className="w-[58px] h-[68px] bg-[#3382d2] rounded-2xl"></div>
        <div className="flex flex-col">
          <h1 className="text-[1.875rem] font-bold text-white leading-[1.2]">
            Lucy
          </h1>
          <p className="text-text-five leading-[1.5]">
            Sistema de Prescrições Médicas
          </p>
        </div>
      </div>
      <h2 className="mt-8 text-4xl font-bold leading-[1.25] text-white">
        Revolucione sua prática odontológica
      </h2>
      <p className="text-xl leading-[1.4] text-text-five mt-6">
        Gerencie prescrições digitais de forma segura e conecte-se
        automaticamente com seus pacientes
      </p>
      <div className="flex flex-col gap-6 mt-8">
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
        'flex items-center p-4 gap-4 bg-white/25 rounded-xl',
        'border border-white/18',
      )}
    >
      <div
        className={cn('w-12 rounded-lg h-12 flex items-center justify-center', {
          'bg-green-one': color === 'green',
          'bg-blue-one': color === 'blue',
          'bg-yellow-one': color === 'yellow',
        })}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-white text-lg leading-[1.55]">
          {title}
        </h3>
        <p className="text-text-five text-sm leading-[1.42]">{description}</p>
      </div>
    </div>
  )
}
