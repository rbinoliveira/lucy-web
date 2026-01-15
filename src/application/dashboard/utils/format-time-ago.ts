export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Agora'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `Há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `Há ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `Há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`
}
