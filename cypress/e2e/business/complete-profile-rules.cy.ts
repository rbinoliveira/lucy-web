/// <reference types="cypress" />

import { COMPLETE_PROFILE_URL } from '../constants'

const incompleteDentistUser = {
  id: 'dentist-uid-3',
  email: 'dentista.perfil@example.com',
  name: 'Dr. Perfil',
  role: 'dentist' as const,
  photo: '',
  cro: '',
  phone: '',
  status: 'pending' as const,
}

describe('Business rules - complete profile', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.setAuthCookie(incompleteDentistUser)
    cy.visit(COMPLETE_PROFILE_URL)
  })

  it('requires CRO with only digits and 4 to 7 characters', () => {
    cy.get('input#cro').clear().type('123')
    cy.get('input#phone').clear().type('11999999999')
    cy.contains('button', 'Completar').click()

    cy.contains(
      'CRO inválido — deve conter somente dígitos (4 a 7 caracteres).',
    ).should('be.visible')
  })

  it('requires complete phone number', () => {
    cy.get('input#cro').clear().type('12345')
    cy.get('input#phone').clear().type('1199999')
    cy.contains('button', 'Completar').click()

    cy.contains('Complete o telefone').should('be.visible')
  })

  it('enables submit when profile data is valid', () => {
    cy.get('button').contains('Completar').should('be.disabled')

    cy.get('input#cro').clear().type('12345')
    cy.get('input#phone').clear().type('11999999999')

    cy.get('button').contains('Completar').should('not.be.disabled')
  })
})
