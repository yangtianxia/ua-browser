/**
 * A subset of the Navigator interface that our detectors need.
 * Accepting NavContext as a parameter makes every detector pure and testable.
 */
export interface NavContext {
  userAgent: string
  platform: string
  language: string
  browserLanguage?: string
  maxTouchPoints: number
  mimeTypes?: MimeTypeArray
  connection?: { saveData?: boolean }
  userAgentData?: {
    platform: string
    getHighEntropyValues(hints: string[]): Promise<Record<string, string>>
  }
}

/** Build a NavContext from the real browser `navigator`, or return a safe default for Node.js. */
export function getNavContext(): NavContext {
  if (typeof navigator === 'undefined') {
    return { userAgent: '', platform: '', language: '', maxTouchPoints: 0 }
  }
  return navigator as unknown as NavContext
}

/** Safely query a MIME type from the nav context. Returns false in non-browser envs. */
export function getMimeType(nav: NavContext, type: string): boolean {
  try {
    return !!nav.mimeTypes?.namedItem(type)
  } catch {
    return false
  }
}

/** Returns the normalised browser language (e.g. "zh-CN" → "zh-CN", "en-us" → "en-US"). */
export function getLanguage(nav: NavContext): string {
  const raw = nav.browserLanguage ?? nav.language ?? ''
  const normalised = raw.replace(/-\w+/g, (w) => w.toUpperCase())
  return normalised || 'unknown'
}
