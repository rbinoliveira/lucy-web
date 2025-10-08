import { NextResponse } from 'next/server'

import { dbAdmin } from '@/application/_shared/libs/firebase-admin'

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const docRef = dbAdmin.collection('users').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: 'Paciente não encontrado.' },
        { status: 404 },
      )
    }

    await docRef.delete()

    return NextResponse.json({
      success: true,
      message: 'Paciente excluído com sucesso.',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Ocorreu um erro interno, tente novamente mais tarde.',
      },
      { status: 500 },
    )
  }
}
