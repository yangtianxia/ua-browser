import type { EnvOption } from './types.js'
import type { UAHighEntropyValues, EnvContext } from './utils/env-context.js'
import { parseUA } from './parse.js'

/**
 * The Accept-CH value to send in server responses.
 * After the browser sees this header it will include the corresponding
 * Sec-CH-UA-* headers on subsequent same-origin requests.
 */
export const ACCEPT_CH = [
  'Sec-CH-UA-Arch',
  'Sec-CH-UA-Bitness',
  'Sec-CH-UA-Platform-Version',
  'Sec-CH-UA-Model',
  'Sec-CH-UA-Full-Version-List',
].join(', ')

/** Strip the surrounding double-quotes that browsers add to structured header values. */
function unquote(value: string | undefined): string | undefined {
  if (value == null) return undefined
  return value.replace(/^"|"$/g, '').trim() || undefined
}

function deriveWindowsVersion(platformVersion: string | undefined): string | null {
  if (!platformVersion) return null
  const major = parseInt(platformVersion.split('.')[0] ?? '0', 10)
  return isNaN(major) ? null : major >= 13 ? '11' : '10'
}

/**
 * Parse a browser request's HTTP headers into an EnvOption.
 *
 * Reads the standard `user-agent` header plus any `Sec-CH-UA-*` Client Hints
 * headers the browser sent after receiving an `Accept-CH` response header.
 *
 * Header names are matched case-insensitively, as required by HTTP/1.1 and HTTP/2.
 *
 * @example
 * // Express / Node.js
 * res.setHeader('Accept-CH', ACCEPT_CH)
 * const result = parseHeaders(req.headers)
 */
export function parseHeaders(headers: Record<string, string | string[] | undefined>): EnvOption {
  // Normalise all header keys to lowercase for case-insensitive lookup (HTTP spec)
  const normalised: Record<string, string | string[] | undefined> = {}
  for (const key of Object.keys(headers)) {
    normalised[key.toLowerCase()] = headers[key]
  }
  const get = (name: string): string | undefined => {
    const v = normalised[name.toLowerCase()]
    return Array.isArray(v) ? v[0] : v
  }

  const ua = get('user-agent') ?? ''

  const architecture = unquote(get('sec-ch-ua-arch'))
  const bitness = unquote(get('sec-ch-ua-bitness'))
  const model = unquote(get('sec-ch-ua-model'))
  const platformVersion = unquote(get('sec-ch-ua-platform-version'))
  const platform = unquote(get('sec-ch-ua-platform')) ?? ''

  const highEntropyData: UAHighEntropyValues = {}
  if (architecture !== undefined) highEntropyData.architecture = architecture
  if (bitness !== undefined) highEntropyData.bitness = bitness
  if (model !== undefined) highEntropyData.model = model
  if (platformVersion !== undefined) highEntropyData.platformVersion = platformVersion

  const isMobile = get('sec-ch-ua-mobile') === '?1'

  const windowsVersion = platform === 'Windows'
    ? deriveWindowsVersion(platformVersion)
    : null

  const ctx: EnvContext = {
    userAgent: ua,
    platform,
    language: '',
    maxTouchPoints: isMobile ? 1 : 0,
    highEntropyData: Object.keys(highEntropyData).length > 0 ? highEntropyData : undefined,
    windowsVersion,
  }

  return parseUA(ua, { ctx })
}
