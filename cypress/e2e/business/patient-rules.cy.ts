/// <reference types="cypress" />

import { CREATE_PATIENT_URL } from '../constants'

const completeDentistUser = {
  id: 'dentist-uid-4',
  email: 'dentista.patients@example.com',
  name: 'Dr. Patients',
  role: 'dentist' as const,
  photo: '',
  cro: '12345',
  phone: '(11) 99999-9999',
  status: 'approved' as const,
}

describe('Business rules - patients', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.setAuthCookie(completeDentistUser)
    cy.visit(CREATE_PATIENT_URL)
  })

  it('enforces patient e-mail as mandatory field on submit', () => {
    cy.contains(
      '+ Mostrar campos opcionais (email, CPF, endereço, SUS)',
    ).click()
    cy.contains('button', 'Salvar Paciente').click()

    cy.contains('email é obrigatório').should('be.visible')
  })
})
