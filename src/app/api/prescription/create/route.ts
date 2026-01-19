import { NextResponse } from 'next/server'

import { savePrescriptionUseCaseSchema } from '@/features/prescription/schemas/save-prescription.schema'
import {
  normalizeName,
  normalizePhone,
} from '@/shared/helpers/normalize-string.helper'
import { dbAdmin } from '@/shared/libs/firebase-admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ✅ Validação do corpo da requisição
    const parsed = savePrescriptionUseCaseSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const data = parsed.data

    // ✅ Verifica se já existe um registro com o mesmo e-mail
    const prescriptionsRef = dbAdmin.collection('prescriptions')
    const existing = await prescriptionsRef
      .where('email', '==', data.email)
      .limit(1)
      .get()

    if (!existing.empty) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado na plataforma, tente outro e-mail.' },
        { status: 400 },
      )
    }

    // ✅ Cria o novo documento no Firestore
    const newDocRef = prescriptionsRef.doc()
    await newDocRef.set({
      id: newDocRef.id,
      name: data.name,
      phone: data.phone,
      dob: data.dob,
      email: data.email,
      ownerId: data.ownerId,
      role: 'prescription',
      nameNormalized: normalizeName(data.name),
      phoneNormalized: normalizePhone(data.phone),
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      message: 'Prescrição registrada com sucesso.',
      id: newDocRef.id,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}
