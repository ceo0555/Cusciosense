import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(date: string | Date, pattern: string = 'PPP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, pattern)
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'PPP p')
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function isOverdue(dueDate: string | Date): boolean {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
  return dateObj < new Date()
}
