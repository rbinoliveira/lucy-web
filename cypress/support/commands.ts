/// <reference types="cypress" />

// Cookie name matches the pattern: `${NEXT_PUBLIC_APP_NAME}_user`
// NEXT_PUBLIC_APP_NAME=lucy  →  cookie name = "lucy_user"
const AUTH_COOKIE_NAME = 'lucy_user'

type LoginByFirebaseOptions = {
  email: string
  password: string
}

Cypress.Commands.add(
  'loginByFirebase',
  ({ email, password }: LoginByFirebaseOptions) => {
    const apiKey = Cypress.env('FIREBASE_API_KEY') as string

    cy.request({
      method: 'POST',
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      body: {
        email,
        password,
        returnSecureToken: true,
      },
      failOnStatusCode: true,
    }).then((response) => {
      const { idToken, localId, email: userEmail } = response.body as {
        idToken: string
        localId: string
        email: string
      }

      // Build the user object that the app stores in the cookie.
      // The cookie value is JSON.stringify(UserModel).
      const userPayload = {
        id: localId,
        email: userEmail,
        name: '',
        role: 'dentist',
        photo: '',
      }

      cy.setCookie(AUTH_COOKIE_NAME, JSON.stringify(userPayload), {
        sameSite: 'lax',
        secure: false,
      })

      // Store the idToken in case a test needs it for API calls.
      Cypress.env('authToken', idToken)
    })
  },
)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginByFirebase(options: LoginByFirebaseOptions): Chainable<void>
    }
  }
}
