export type PharmaceuticalForm =
  | 'solucao_oral'
  | 'suspensao_oral'
  | 'comprimido'
  | 'capsula'
  | 'pilula'
  | 'pastilha'
  | 'dragea'
  | 'xarope'
  | 'gotas'
  | 'pomada'
  | 'creme'
  | 'pasta'
  | 'spray'

export type AdministrationRoute = 'oral' | 'sublingual' | 'topica'

export type MedicineModel = {
  id: string
  name: string
  nameNormalized: string
  dose: string
  pharmaceuticalForm: PharmaceuticalForm
  administrationRoute: AdministrationRoute
  quantity: number
  intervalHours: number
  durationDays?: number
  whilePain?: boolean
  defaultDosage: string
  ownerId: string
  createdAt?: Date
  updatedAt?: Date
}

export const pharmaceuticalFormLabels: Record<PharmaceuticalForm, string> = {
  solucao_oral: 'Solução oral',
  suspensao_oral: 'Suspensão oral',
  comprimido: 'Comprimido',
  capsula: 'Cápsula',
  pilula: 'Pílula',
  pastilha: 'Pastilha',
  dragea: 'Drágea',
  xarope: 'Xarope',
  gotas: 'Gotas',
  pomada: 'Pomada',
  creme: 'Creme',
  pasta: 'Pasta',
  spray: 'Spray/aerossol',
}

export const administrationRouteLabels: Record<AdministrationRoute, string> = {
  oral: 'Oral',
  sublingual: 'Sublingual',
  topica: 'Tópica',
}

export const pharmaceuticalFormVerbs: Record<PharmaceuticalForm, string> = {
  solucao_oral: 'tomar',
  suspensao_oral: 'tomar',
  comprimido: 'tomar',
  capsula: 'tomar',
  pilula: 'tomar',
  pastilha: 'chupar',
  dragea: 'tomar',
  xarope: 'tomar',
  gotas: 'tomar',
  pomada: 'aplicar',
  creme: 'aplicar',
  pasta: 'aplicar',
  spray: 'aplicar',
}

export type GenerateDosageInput = {
  pharmaceuticalForm?: PharmaceuticalForm | string
  administrationRoute?: AdministrationRoute | string
  quantity?: number
  intervalHours?: number
  durationDays?: number
  whilePain?: boolean
}

export function generateDosage(medicine: GenerateDosageInput): string {
  if (
    !medicine.pharmaceuticalForm ||
    !medicine.administrationRoute ||
    !medicine.quantity ||
    !medicine.intervalHours
  ) {
    return ''
  }

  const form = medicine.pharmaceuticalForm as PharmaceuticalForm
  const route = medicine.administrationRoute as AdministrationRoute

  const verb = pharmaceuticalFormVerbs[form]
  const formLabel = pharmaceuticalFormLabels[form].toLowerCase()
  const routeLabel = administrationRouteLabels[route].toLowerCase()

  let duration = ''
  if (medicine.whilePain) {
    duration = 'enquanto houver dor'
  } else if (medicine.durationDays) {
    duration = `por ${medicine.durationDays} ${medicine.durationDays === 1 ? 'dia' : 'dias'}`
  }

  return `${verb} ${medicine.quantity} ${formLabel} via ${routeLabel} a cada ${medicine.intervalHours} horas ${duration}`.trim()
}
