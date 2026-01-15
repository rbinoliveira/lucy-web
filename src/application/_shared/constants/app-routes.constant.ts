export const appRoutes = {
  dashboard: '/dashboard',
  signIn: '/',
  auth: '/auth',
  register: '/registrar',
  recoverPassword: '/recuperar-senha',
  completeProfile: '/completar-perfil',
  patients: '/pacientes',
  prescriptions: '/prescricoes',
  medicines: '/medicamentos',
}

export const appPublicRoutes = [
  appRoutes.signIn,
  appRoutes.register,
  appRoutes.recoverPassword,
]
