/// <reference types="cypress" />

import { REGISTER_URL } from '../constants'

describe('Register page', () => {
  beforeEach(() => {
    cy.visit(REGISTER_URL)
  })

  it('shows the register form', () => {
    cy.contains('h1', 'Cadastre-se!').should('be.visible')
    cy.get('input#name').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('input#confirmPassword').should('be.visible')
    cy.get('button[type="submit"]').contains('Cadastrar').should('be.visible')
  })

  it('shows validation errors when submitting empty fields', () => {
    cy.get('button[type="submit"]').click()

    cy.get('form').within(() => {
      cy.contains(/name é obrigatório/i, { timeout: 8000 }).should('be.visible')
      cy.contains(/e-mail é obrigatório|digite um e-mail válido/i, {
        timeout: 8000,
      }).should('be.visible')
      cy.contains(/senha|confirmar senha/i, { timeout: 8000 }).should(
        'be.visible',
      )
    })
  })

  it('shows a validation error for an invalid email format', () => {
    cy.get('input#name').type('Dr. Teste')
    cy.get('input#email').type('invalidemail')
    cy.get('input#password').type('senha123')
    cy.get('input#confirmPassword').type('senha123')
    cy.get('button[type="submit"]').click()

    cy.contains('Digite um e-mail válido').should('be.visible')
  })

  it('shows an error when passwords do not match', () => {
    cy.get('input#name').type('Dr. Teste')
    cy.get('input#email').type('dr.teste@clinica.com')
    cy.get('input#password').type('senha123')
    cy.get('input#confirmPassword').type('senha456')
    cy.get('button[type="submit"]').click()

    cy.contains('As senhas não coincidem').should('be.visible')
  })

  it('shows password length validation when password is too short', () => {
    cy.get('input#name').type('Dr. Teste')
    cy.get('input#email').type('dr.teste@clinica.com')
    cy.get('input#password').type('abc')
    cy.get('input#confirmPassword').type('abc')
    cy.get('button[type="submit"]').click()

    cy.contains(/pelo menos 6 caracteres/i).should('be.visible')
  })

  it('submits the form with valid data and shows success feedback', () => {
    const uniqueEmail = `test+${Date.now()}@example.com`

    cy.get('input#name').type('Dr. Cypress')
    cy.get('input#email').type(uniqueEmail)
    cy.get('input#password').type('senha123')
    cy.get('input#confirmPassword').type('senha123')
    cy.get('button[type="submit"]').click()

    // After successful registration the app shows a toast "Conta criada com sucesso"
    cy.contains('Conta criada com sucesso', { timeout: 10000 }).should(
      'be.visible',
    )
  })

  it('navigates to login page when clicking "Acesse sua conta"', () => {
    cy.contains('Acesse sua conta').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })
})
