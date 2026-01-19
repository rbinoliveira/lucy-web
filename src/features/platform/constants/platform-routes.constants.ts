export const platformRoutes = {
  home: '/feed',
  feed: '/feed',
  myAccount: '/my-account',
  faq: '/faq',
  signIn: '/',
  signUp: '/signup',
  notification: '/notifications',
  metrics: '/metrics',
  calendar: '/calendar',
  shop: '/shop',
  saved: '/feed/saved',
  profile: (profileId: string) => `/feed/profile/${profileId}`,
  attendance: '/attendance',
  class: '/class',
  dashboard: '/dashboard',
  event: '/event',
  member: '/member',
  subscribe: '/subscribe',
  subscribeComplete: '/subscribe-complete',
  kiosk: '/kiosk',
  billing: '/billing',
  booking: '/booking',
}

export const unloggedRoutes = [platformRoutes.signIn, platformRoutes.signUp]

export const publicRoutes = [platformRoutes.booking]

export const loggedRoutes = Object.values(platformRoutes)
  .filter((route) => typeof route === 'string')
  .filter((route) => !unloggedRoutes.includes(route as string))
