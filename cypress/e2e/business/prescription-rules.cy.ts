/// <reference types="cypress" />

const CREATE_PRESCRIPTION_URL = '/prescricoes/adicionar'

const completeDentistUser = {
  id: 'dentist-uid-5',
  email: 'dentista.prescriptions@example.com',
  name: 'Dr. Prescriptions',
  role: 'dentist' as const,
  photo: '',
  cro: '12345',
  phone: '(11) 99999-9999',
  status: 'approved' as const,
}

describe('Business rules - prescriptions', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.setAuthCookie(completeDentistUser)
  })

  it('requires patient, medicine and dosage on create', () => {
    cy.visit(CREATE_PRESCRIPTION_URL)

    cy.contains('button', 'Criar Prescrição').click()

    cy.contains('paciente é obrigatório').should('be.visible')
    cy.contains('e-mail do paciente é obrigatório').should('be.visible')
    cy.contains('nome do medicamento é obrigatório').should('be.visible')
    cy.contains('posologia é obrigatório').should('be.visible')
  })

  it('prefills patientName when received by query string', () => {
    cy.visit(`${CREATE_PRESCRIPTION_URL}?patientName=Maria%20Silva`)

    cy.get('input[placeholder="Buscar paciente..."]').should(
      'have.value',
      'Maria Silva',
    )
  })
})
