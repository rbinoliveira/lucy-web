import { z } from 'zod'

type RequiredDateProps = {
  field: string
}

export const requiredDate = ({ field }: RequiredDateProps) => {
  return z.date({
    message: `${field} é obrigatório`,
  })
}
