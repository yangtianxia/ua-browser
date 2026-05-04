import pkg from '../package.json' with { type: 'json' }
const { version: VERSION } = pkg
import { parseUA } from './parse.js'
import { getNavContext, getLanguage } from './utils/navigator.js'
import { isWebview } from './detectors/webview.js'
import type { EnvOption } from './types.js'

// ── Named exports (tree-shakeable) ──────────────────────────────────────────
export type { EnvOption, BrowserName, OsName, EngineName, DeviceName, ArchName, BotName } from './types.js'
export { parseUA } from './parse.js'
export { getLanguage, getNavContext } from './utils/navigator.js'
export { getWindowsVersion } from './utils/windows-version.js'
export { getEnvContext } from './utils/env-context.js'
export type { EnvContext, UAHighEntropyValues } from './utils/env-context.js'
export { detectBot } from './detectors/bot.js'
export { detectArch } from './detectors/arch.js'
export { detectHeadless } from './detectors/headless.js'
export { isWebview } from './detectors/webview.js'
export { parseHeaders, ACCEPT_CH } from './parse-headers.js'
export { VERSION }

/** Check whether the current context is a WeChat mini-program. */
export const isWechatMiniapp = (): boolean => {
  try {
    return typeof __wxjs_environment !== 'undefined' && __wxjs_environment === 'miniprogram'
  } catch {
    return false
  }
}

/** Check whether the current context is an Alipay mini-program. */
export const isAlipayMiniapp = (): boolean => {
  try {
    return typeof window !== 'undefined' &&
      typeof (window as unknown as { my?: { getSystemInfo?: unknown } }).my?.getSystemInfo === 'function'
  } catch {
    return false
  }
}

/** Check whether the current context is a Baidu Smart mini-program. */
export const isBaiduMiniapp = (): boolean => {
  try {
    return typeof swan !== 'undefined' && typeof swan?.getSystemInfo === 'function'
  } catch {
    return false
  }
}

/** Check whether the current context is a Douyin mini-program. */
export const isDouyinMiniapp = (): boolean => {
  try {
    return typeof tt !== 'undefined' && typeof tt?.getSystemInfo === 'function'
  } catch {
    return false
  }
}

/** Check whether the current context is a QQ mini-program. */
export const isQQMiniapp = (): boolean => {
  try {
    return typeof qq !== 'undefined' && typeof qq?.getSystemInfo === 'function'
  } catch {
    return false
  }
}

/** Check whether the current context is a Kuaishou mini-program. */
export const isKuaishouMiniapp = (): boolean => {
  try {
    return typeof ks !== 'undefined' && typeof ks?.getSystemInfo === 'function'
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
uaBrowser.isAlipayMiniapp = isAlipayMiniapp
uaBrowser.isBaiduMiniapp = isBaiduMiniapp
uaBrowser.isDouyinMiniapp = isDouyinMiniapp
uaBrowser.isQQMiniapp = isQQMiniapp
uaBrowser.isKuaishouMiniapp = isKuaishouMiniapp
uaBrowser.getLanguage = (): string => getLanguage(getNavContext())
uaBrowser.VERSION = VERSION

export default uaBrowser
