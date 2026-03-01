/// <reference types="cypress" />

import { CREATE_MEDICINE_URL } from '../constants'

const completeAdminUser = {
  id: 'admin-uid-2',
  email: 'admin.medicines@example.com',
  name: 'Admin Medicines',
  role: 'admin' as const,
  photo: '',
  cro: '12345',
  phone: '(11) 99999-9999',
  status: 'approved' as const,
}

describe('Business rules - medicines', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.setAuthCookie(completeAdminUser)
    cy.visit(CREATE_MEDICINE_URL)
  })

  it('requires duration in days or "whilePain" flag', () => {
    cy.get('input#name').type('Amoxicilina')
    cy.get('input#dose').type('500mg')

    cy.contains('label', 'Forma Farmacêutica').parent().find('button').click()
    cy.contains('Comprimido').click()

    cy.contains('label', 'Via de Administração').parent().find('button').click()
    cy.contains('Oral').click()

    cy.get('input#quantity').clear().type('1')
    cy.get('input#intervalHours').clear().type('8')

    cy.contains('button', 'Salvar Medicamento').click()

    cy.contains(
      'Informe a duração em dias ou marque "enquanto houver dor"',
    ).should('be.visible')
  })

  it('disables duration field when "while pain" is checked', () => {
    cy.get('input#durationDays').should('not.be.disabled')
    cy.get('input[type="checkbox"]').check({ force: true })
    cy.get('input#durationDays').should('be.disabled')
  })
})
