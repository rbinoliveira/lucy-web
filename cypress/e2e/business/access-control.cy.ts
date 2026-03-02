/// <reference types="cypress" />

import {
  COMPLETE_PROFILE_URL,
  DASHBOARD_URL,
  LOGIN_URL,
  RECOVER_PASSWORD_URL,
  REGISTER_URL,
} from '../constants'

const completeDentistUser = {
  id: 'dentist-uid-1',
  email: 'dentista@example.com',
  name: 'Dr. Dentista',
  role: 'dentist' as const,
  photo: '',
  cro: '12345',
  phone: '(11) 99999-9999',
  status: 'approved' as const,
}

const incompleteDentistUser = {
  id: 'dentist-uid-2',
  email: 'dentista.incompleto@example.com',
  name: 'Dr. Incompleto',
  role: 'dentist' as const,
  photo: '',
  cro: '',
  phone: '',
  status: 'pending' as const,
}

describe('Business rules - access control and route guards', () => {
  beforeEach(() => {
    cy.clearCookies()
  })

  it('redirects unauthenticated users from protected routes to login', () => {
    cy.visit(DASHBOARD_URL)

    cy.location('pathname').should('eq', LOGIN_URL)
  })

  it('redirects authenticated users with incomplete profile to /completar-perfil', () => {
    cy.setAuthCookie(incompleteDentistUser)

    cy.visit(DASHBOARD_URL)

    cy.location('pathname').should('eq', COMPLETE_PROFILE_URL)
    cy.contains('h1', 'Complete seu perfil').should('be.visible')
  })

  it('keeps incomplete-profile users on /completar-perfil', () => {
    cy.setAuthCookie(incompleteDentistUser)

    cy.visit(COMPLETE_PROFILE_URL)

    cy.location('pathname').should('eq', COMPLETE_PROFILE_URL)
    cy.contains('h1', 'Complete seu perfil').should('be.visible')
  })

  it('redirects complete authenticated users away from public routes', () => {
    cy.setAuthCookie(completeDentistUser)

    cy.visit(LOGIN_URL)

    cy.location('pathname').should('eq', DASHBOARD_URL)
  })

  it('redirects authenticated users away from /registrar', () => {
    cy.setAuthCookie(completeDentistUser)

    cy.visit(REGISTER_URL)
    cy.location('pathname', { timeout: 8000 }).should('eq', DASHBOARD_URL)
  })

  it('redirects authenticated users away from /recuperar-senha', () => {
    cy.setAuthCookie(completeDentistUser)

    cy.visit(RECOVER_PASSWORD_URL)
    cy.location('pathname', { timeout: 8000 }).should('eq', DASHBOARD_URL)
  })

  it('redirects complete authenticated users away from /completar-perfil', () => {
    cy.setAuthCookie(completeDentistUser)

    cy.visit(COMPLETE_PROFILE_URL)

    cy.location('pathname').should('eq', DASHBOARD_URL)
  })

  it('treats malformed auth cookie as unauthenticated and redirects to login', () => {
    cy.setCookie('lucy_user', '{invalid-json', {
      sameSite: 'lax',
      secure: false,
    })

    cy.visit(DASHBOARD_URL)
    cy.location('pathname').should('eq', LOGIN_URL)
  })
})
