import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_HEADER,
  type Locale,
} from "@/i18n/config"

/**
 * Locale of a request rewritten by src/proxy.ts. Route handlers see the
 * original URL, so the proxy passes the locale as a request header.
 */
export function getRequestLocale(request: Request): Locale {
  const value = request.headers.get(LOCALE_HEADER) ?? ""
  return isLocale(value) ? value : DEFAULT_LOCALE
}
