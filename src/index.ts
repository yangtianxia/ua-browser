import pkg from '../package.json' with { type: 'json' }
import { parseUA } from './parse.js'
import { getNavContext, getLanguage } from './utils/navigator.js'
import { getEnvContext } from './utils/env-context.js'
import { isWebview } from './detectors/webview.js'
import type { EnvOption } from './types.js'

// ── Named exports (tree-shakeable) ──────────────────────────────────────────
export type { EnvOption, BrowserName, OsName, EngineName, DeviceName, ArchName, BotName } from './types.js'
export { parseUA } from './parse.js'
export { getLanguage, getNavContext } from './utils/navigator.js'
export { getWindowsVersion } from './utils/windows-version.js'
export { getEnvContext, type EnvContext, type UAHighEntropyValues } from './utils/env-context.js'
export { detectBot } from './detectors/bot.js'
export type { BotDef } from './detectors/bot.js'
export { detectBrowser } from './detectors/browser.js'
export { detectOs as detectOS } from './detectors/os.js'
export { detectArch } from './detectors/arch.js'
export { detectEngine } from './detectors/engine.js'
export { detectDevice } from './detectors/device.js'
export { detectHeadless } from './detectors/headless.js'
export { isWebview } from './detectors/webview.js'
export { satisfies } from './utils/satisfies.js'
export { parseHeaders, ACCEPT_CH } from './parse-headers.js'

const { version: VERSION } = pkg
export { VERSION }

// ── Default export — maintains v0.x call signature ──────────────────────────

/**
 * Detect browser, OS, engine and device information from the current browser environment.
 */
function uaBrowser(): EnvOption {
  const nav = getNavContext()
  return parseUA(nav.userAgent, { nav })
}

/**
 * Collect full hardware context and detect browser, OS, engine and device information.
 *
 * Hardware signals (Client Hints, WebGL, platform) take precedence over the UA string.
 * Async because Client Hints high-entropy values require a browser API call.
 */
uaBrowser.detect = async (ua?: string): Promise<EnvOption> => {
  const ctx = await getEnvContext()
  return parseUA(ua ?? ctx.userAgent, { ctx })
}

uaBrowser.isWebview = isWebview
uaBrowser.getLanguage = (): string => getLanguage(getNavContext())
uaBrowser.VERSION = VERSION

export default uaBrowser
