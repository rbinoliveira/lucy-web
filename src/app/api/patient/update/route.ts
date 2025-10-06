import { differenceInDays } from 'date-fns'
import { NextResponse } from 'next/server'

import { authAdmin, dbAdmin } from '@/application/_shared/libs/firebase-admin'
import { PatientModel } from '@/application/patient/models/patient.model'
import { savePatientUseCaseSchema } from '@/application/patient/schemas/save-patient.schema'

export async function PUT(req: Request) {
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
    const userId = data.id

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório.' },
        { status: 400 },
      )
    }

    const userDoc = await dbAdmin.collection('users').doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado no Firestore.' },
        { status: 404 },
      )
    }

    const userData = userDoc.data() as PatientModel

    let authUser
    try {
      authUser = await authAdmin.getUser(userId)
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Usuário não encontrado no Auth.' },
        { status: 404 },
      )
    }

    const authUpdates: any = {}
    if (data.name && data.name !== authUser.displayName) {
      authUpdates.displayName = data.name
    }
    if (data.email && data.email !== authUser.email) {
      authUpdates.email = data.email
    }
    if (
      differenceInDays(new Date(data.dob), new Date(userData.dob)) !== 0 &&
      data.password
    ) {
      authUpdates.password = data.password
    }

    if (Object.keys(authUpdates).length > 0) {
      await authAdmin.updateUser(userId, authUpdates)
    }

    await dbAdmin.collection('users').doc(userId).update({
      name: data.name,
      phone: data.phone,
      dob: data.dob,
      email: data.email,
      ownerId: data.ownerId,
    })

    return NextResponse.json({
      message: 'Usuário atualizado com sucesso no Auth e Firestore.',
      uid: userId,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
