// Formatter manual — evita hydration mismatch entre server (Node) e client (browser)
export const formatBRL = (value: number): string => {
  const n = Math.round(value)
  const s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `R$ ${s}`
}

export const formatDate = (date: Date): string => {
  const days   = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB']
  const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
  return `${days[date.getDay()]} · ${date.getDate()} ${months[date.getMonth()]}`
}
