import { NextResponse } from 'next/server'

import { getCurrentUserApi } from '@/shared/helpers/get-current-user-api.helper'
import { dbAdmin } from '@/shared/libs/firebase-admin'

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const user = await getCurrentUserApi()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado.' },
        { status: 401 },
      )
    }

    const docRef = dbAdmin.collection('users').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: 'Paciente não encontrado.' },
        { status: 404 },
      )
    }

    const data = docSnap.data()

    if (data?.ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Não autorizado.' },
        { status: 403 },
      )
    }

    await docRef.delete()

    return NextResponse.json({
      success: true,
      message: 'Paciente excluído com sucesso.',
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Ocorreu um erro interno, tente novamente mais tarde.',
      },
      { status: 500 },
    )
  }
}
