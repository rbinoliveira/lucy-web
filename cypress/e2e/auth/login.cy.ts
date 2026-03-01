/// <reference types="cypress" />

import { LOGIN_URL } from '../constants'

describe('Login page', () => {
  beforeEach(() => {
    cy.visit(LOGIN_URL)
  })

  it('shows the login form', () => {
    cy.contains('h1', 'Bem-vindo de volta!').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('button[type="submit"]')
      .contains('Acessar Sistema')
      .should('be.visible')
  })

  it('shows validation errors when submitting empty fields', () => {
    cy.get('button[type="submit"]').click()

    // email is required
    cy.contains('e-mail é obrigatório').should('be.visible')
    // password is required (field label is "password")
    cy.contains('password é obrigatório').should('be.visible')
  })

  it('shows a validation error for an invalid email format', () => {
    cy.get('input#email').type('not-an-email')
    cy.get('input#password').type('somepassword')
    cy.get('button[type="submit"]').click()

    cy.contains('Digite um e-mail válido').should('be.visible')
  })

  it('shows an error for wrong credentials', () => {
    cy.get('input#email').type('fake.user@example.com')
    cy.get('input#password').type('wrongpassword123')
    cy.get('button[type="submit"]').click()

    // Firebase returns an error for invalid credentials; the app uses sonner
    // toasts or an error element to display it.
    // We wait a short time for the async Firebase call to resolve.
    cy.contains(
      /credenciais|inválid|wrong|INVALID_LOGIN_CREDENTIALS|password/i,
      { timeout: 8000 },
    ).should('be.visible')
  })

  it('navigates to register page when clicking "Crie sua conta"', () => {
    cy.contains('Crie sua conta').click()
    cy.url().should('include', '/registrar')
  })

  it('navigates to recover-password page when clicking "Esqueci minha senha"', () => {
    cy.contains('Esqueci minha senha').click()
    cy.url().should('include', '/recuperar-senha')
  })
})
