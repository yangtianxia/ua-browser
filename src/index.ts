import pkg from '../package.json' with { type: 'json' }
const { version: VERSION } = pkg
import { parseUA } from './parse.js'
import { getNavContext, getLanguage } from './utils/navigator.js'
import type { EnvOption } from './types.js'

// ── Named exports (tree-shakeable) ──────────────────────────────────────────
export type { EnvOption, BrowserName, OsName, EngineName, DeviceName, ArchName, BotName } from './types.js'
export { parseUA } from './parse.js'
export { getLanguage, getNavContext } from './utils/navigator.js'
export { getWindowsVersion } from './utils/windows-version.js'
export { detectBot } from './detectors/bot.js'
export { detectArch } from './detectors/arch.js'
export { detectHeadless } from './detectors/headless.js'
export { VERSION }

/** Check whether a UA string indicates an Android webview environment. */
export const isWebview = (ua: string): boolean => /; wv/.test(ua)

/** Check whether the current context is a WeChat mini-program. */
export const isWechatMiniapp = (): boolean => {
  try {
    return typeof __wxjs_environment !== 'undefined' && __wxjs_environment === 'miniprogram'
  } catch {
    return false
  }
}

// ── Default export — maintains v0.x call signature ──────────────────────────

/**
 * Detect browser, OS, engine and device information.
 *
 * @param ua - Optional UA string override. Defaults to `navigator.userAgent`.
 */
function uaBrowser(ua?: string): EnvOption {
  const nav = getNavContext()
  return parseUA(ua ?? nav.userAgent, { nav })
}

uaBrowser.isWebview = isWebview
uaBrowser.isWechatMiniapp = isWechatMiniapp
uaBrowser.getLanguage = (): string => getLanguage(getNavContext())
uaBrowser.VERSION = VERSION

export default uaBrowser
