/// <reference types="cypress" />

const LOGIN_URL = '/'
const REGISTER_URL = '/registrar'
const RECOVER_PASSWORD_URL = '/recuperar-senha'
const DASHBOARD_URL = '/dashboard'
const COMPLETE_PROFILE_URL = '/completar-perfil'

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

const completeAdminUser = {
  id: 'admin-uid-1',
  email: 'admin@example.com',
  name: 'Admin Lucy',
  role: 'admin' as const,
  photo: '',
  cro: '67890',
  phone: '(11) 98888-7777',
  status: 'approved' as const,
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

  it('redirects authenticated users away from /registrar and /recuperar-senha', () => {
    cy.setAuthCookie(completeDentistUser)

    cy.visit(REGISTER_URL)
    cy.location('pathname').should('eq', DASHBOARD_URL)

    cy.visit(RECOVER_PASSWORD_URL)
    cy.location('pathname').should('eq', DASHBOARD_URL)
  })

  it('redirects complete authenticated users away from /completar-perfil', () => {
    cy.setAuthCookie(completeDentistUser)

    cy.visit(COMPLETE_PROFILE_URL)

    cy.location('pathname').should('eq', DASHBOARD_URL)
  })

  it('shows medicines menu only for admin users', () => {
    cy.setAuthCookie(completeDentistUser)
    cy.visit(DASHBOARD_URL)
    cy.contains('Pacientes').should('be.visible')
    cy.contains('Prescrições').should('be.visible')
    cy.contains('Medicamentos').should('not.exist')

    cy.clearCookies()

    cy.setAuthCookie(completeAdminUser)
    cy.visit(DASHBOARD_URL)
    cy.contains('Medicamentos').should('be.visible')
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
