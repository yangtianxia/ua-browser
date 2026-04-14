import type { NavContext } from './navigator.js'

/**
 * Asynchronously detect whether the Windows version is 10 or 11 using the
 * User-Agent Client Hints API (navigator.userAgentData).
 *
 * Returns '11', '10', or null (non-Windows / API unavailable / error).
 *
 * Because this is async, callers that need accurate Windows 11 detection
 * should await this result and pass it to parseUA() as `options.windowsVersion`.
 */
export async function getWindowsVersion(nav: NavContext): Promise<string | null> {
  if (!nav.userAgentData || nav.userAgentData.platform !== 'Windows') {
    return null
  }
  try {
    const data = await nav.userAgentData.getHighEntropyValues(['platformVersion'])
    const major = parseInt(data['platformVersion']?.split('.')[0] ?? '0', 10)
    return major >= 13 ? '11' : '10'
  } catch {
    return null
  }
}
