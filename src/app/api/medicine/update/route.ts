import { NextResponse } from 'next/server'

import {
  normalizeName,
  normalizePhone,
} from '@/application/_shared/helpers/normalize-string.helper'
import { dbAdmin } from '@/application/_shared/libs/firebase-admin'
import { saveMedicineUseCaseSchema } from '@/application/medicine/schemas/save-medicine.schema'

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    // ✅ Validação dos dados recebidos
    const parsed = saveMedicineUseCaseSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const data = parsed.data
    const medicineId = data.id

    if (!medicineId) {
      return NextResponse.json(
        { error: 'Medicamento não encontrado.' },
        { status: 404 },
      )
    }

    // ✅ Verifica se o documento existe
    const medicineRef = dbAdmin.collection('medicines').doc(medicineId)
    const medicineSnap = await medicineRef.get()

    if (!medicineSnap.exists) {
      return NextResponse.json(
        { error: 'Medicamento não encontrado.' },
        { status: 404 },
      )
    }

    // ✅ Atualiza os campos no Firestore
    await medicineRef.update({
      name: data.name,
      phone: data.phone,
      dob: data.dob,
      email: data.email,
      ownerId: data.ownerId,
      nameNormalized: normalizeName(data.name),
      phoneNormalized: normalizePhone(data.phone),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      message: 'Medicamento atualizado com sucesso.',
      id: medicineId,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}
