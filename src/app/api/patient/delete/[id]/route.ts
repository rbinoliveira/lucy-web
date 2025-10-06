import { NextResponse } from 'next/server'

import { dbAdmin } from '@/application/_shared/libs/firebase-admin'

type Params = {
  params: {
    id: string
  }
}

export async function DELETE(_: Request, nextParams: Promise<Params>) {
  try {
    const { params } = await nextParams
    const { id } = params

    await dbAdmin.collection('users').doc(id).delete()

    return NextResponse.json({
      success: true,
      message: 'Paciente excluído com sucesso.',
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir paciente.' },
      { status: 500 },
    )
  }
}
