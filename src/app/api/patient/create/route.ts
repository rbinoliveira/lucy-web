import { NextResponse } from 'next/server'

import {
  SavePatientUseCaseSchema,
  savePatientUseCaseSchema,
} from '@/features/patient/schemas/save-patient.schema'
import {
  normalizeName,
  normalizePhone,
} from '@/shared/helpers/normalize-string.helper'
import { authAdmin, dbAdmin } from '@/shared/libs/firebase-admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = savePatientUseCaseSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const data = parsed.data

    if (!data.email) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório.' },
        { status: 400 },
      )
    }

    const usersRef = dbAdmin.collection('users')
    const existingFirestoreUser = await usersRef
      .where('email', '==', data.email)
      .limit(1)
      .get()

    if (!existingFirestoreUser.empty) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado na plataforma, tente outro e-mail.' },
        { status: 400 },
      )
    }

    const email = data.email

    let authUser = null
    try {
      authUser = await authAdmin.getUserByEmail(email)
    } catch (err: unknown) {
      const error = err as { code?: string }
      if (error.code !== 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
          { status: 500 },
        )
      }
    }

    if (authUser) {
      await createPatientInFirestore(authUser.uid, data)

      return NextResponse.json({
        message: 'Paciente criado com sucesso.',
        uid: authUser.uid,
      })
    }

    const dob = new Date(data.dob)
    const dd = String(dob.getDate()).padStart(2, '0')
    const mm = String(dob.getMonth() + 1).padStart(2, '0')
    const yyyy = dob.getFullYear()
    const initialPassword = `${dd}${mm}${yyyy}`

    const newAuthUser = await authAdmin.createUser({
      email,
      displayName: data.name,
      password: initialPassword,
    })

    await createPatientInFirestore(newAuthUser.uid, data)

    return NextResponse.json({
      message: 'Paciente criado com sucesso.',
      uid: newAuthUser.uid,
    })
  } catch {
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}

function createPatientInFirestore(
  docId: string,
  data: SavePatientUseCaseSchema,
) {
  const usersRef = dbAdmin.collection('users')

  return usersRef.doc(docId).set({
    id: docId,
    name: data.name,
    phone: data.phone,
    dob: data.dob,
    email: data.email,
    ownerId: data.ownerId,
    role: 'patient',
    nameNormalized: normalizeName(data.name),
    phoneNormalized: normalizePhone(data.phone),
  })
}
