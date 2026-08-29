import { tournaments } from './tournaments'
export const youthCalendar: Record<number, string[]> = Object.fromEntries(Array.from({ length: 12 }, (_, month) => [month + 1, tournaments.filter((_, i) => i % 12 === month || i % 4 === month % 4).map(t => t.id)]))
export function tournamentsForMonth(month: number) { return tournaments.filter(t => youthCalendar[month]?.includes(t.id)) }
