import { differenceInDays } from 'date-fns'
import { NextResponse } from 'next/server'

import {
  normalizeName,
  normalizePhone,
} from '@/application/_shared/helpers/normalize-string.helper'
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
        { error: 'Paciente não encontrado.' },
        { status: 404 },
      )
    }

    const userDoc = await dbAdmin.collection('users').doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Paciente não encontrado.' },
        { status: 404 },
      )
    }

    const userData = userDoc.data() as PatientModel

    // ------------------------
    // ✅ Verifica e evita email duplicado no Firestore
    // ------------------------
    // Sugestão: normalize o email ao salvar (lowercase + trim). Aqui faço a checagem considerando o valor recebido.
    const newEmail = data.email?.trim()
    const currentEmail = userData.email?.trim()

    if (newEmail && newEmail !== currentEmail) {
      const existing = await dbAdmin
        .collection('users')
        .where('email', '==', newEmail)
        .limit(1)
        .get()

      if (!existing.empty && existing.docs[0].id !== userId) {
        return NextResponse.json(
          { error: 'E-mail já cadastrado na plataforma, tente outro e-mail.' },
          { status: 400 },
        )
      }
    }

    // ------------------------
    // Atualiza também no Auth se necessário (mesma lógica sua)
    // ------------------------
    let authUser
    try {
      authUser = await authAdmin.getUser(userId)
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Paciente não encontrado.' },
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
      try {
        await authAdmin.updateUser(userId, authUpdates)
      } catch (err: any) {
        if (err.code === 'auth/email-already-exists') {
          return NextResponse.json(
            { error: 'E-mail já está em uso por outro usuário no Auth.' },
            { status: 400 },
          )
        }
        console.error('Erro ao atualizar Auth:', err)
        return NextResponse.json(
          { error: 'Ocorreu um erro ao atualizar o usuário no Auth.' },
          { status: 500 },
        )
      }
    }

    // ------------------------
    // Atualiza Firestore
    // ------------------------
    await dbAdmin
      .collection('users')
      .doc(userId)
      .update({
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
      message: 'Paciente atualizado com sucesso.',
      uid: userId,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}
