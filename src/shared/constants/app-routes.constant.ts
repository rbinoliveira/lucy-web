export const appRoutes = {
  dashboard: '/dashboard',
  signIn: '/',
  auth: '/auth',
  register: '/registrar',
  recoverPassword: '/recuperar-senha',
  completeProfile: '/completar-perfil',
  pendingApproval: '/aguardando-aprovacao',
  patients: '/pacientes',
  prescriptions: '/prescricoes',
}

export const appPublicRoutes = [
  appRoutes.signIn,
  appRoutes.register,
  appRoutes.recoverPassword,
]
