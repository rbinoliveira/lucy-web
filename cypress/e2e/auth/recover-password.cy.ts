/// <reference types="cypress" />

const RECOVER_URL = '/recuperar-senha'

describe('Recover password page', () => {
  beforeEach(() => {
    cy.visit(RECOVER_URL)
  })

  it('shows the recover password form', () => {
    cy.contains('h1', 'Recuperar Senha').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('button[type="submit"]').contains('Recuperar').should('be.visible')
  })

  it('shows a validation error when submitting an empty email', () => {
    cy.get('button[type="submit"]').click()

    cy.contains('e-mail é obrigatório').should('be.visible')
  })

  it('shows a validation error for an invalid email format', () => {
    cy.get('input#email').type('not-a-valid-email')
    cy.get('button[type="submit"]').click()

    cy.contains('Digite um e-mail válido').should('be.visible')
  })

  it('shows a success message after submitting a valid email', () => {
    // Firebase sends a success response even if the email does not exist
    cy.get('input#email').type('any.valid.email@example.com')
    cy.get('button[type="submit"]').click()

    // The auth service calls toast.success('E-mail enviado com sucesso') on success
    cy.contains('E-mail enviado com sucesso', { timeout: 10000 }).should('be.visible')
  })

  it('navigates to login page when clicking "Voltar para login"', () => {
    cy.contains('Voltar para login').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })
})
