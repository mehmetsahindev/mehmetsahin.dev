/** Dates are stored as "YYYY-MM" and shown as "MM.YYYY" on the site. */
export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

export function formatMonth(value: string): string {
  const [year, month] = value.split("-")
  return month ? `${month}.${year}` : year
}

export function formatPeriod(start: string, end: string | null) {
  return { start: formatMonth(start), end: end ? formatMonth(end) : undefined }
}
