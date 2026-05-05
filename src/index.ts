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
export { detectArch } from './detectors/arch.js'
export { detectHeadless } from './detectors/headless.js'
export { isWebview } from './detectors/webview.js'
export { parseHeaders, ACCEPT_CH } from './parse-headers.js'

const { version: VERSION } = pkg
export { VERSION }

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

uaBrowser.detect = async (ua?: string): Promise<EnvOption> => {
	const ctx = await getEnvContext()
  return parseUA(ua ?? ctx.userAgent, { ctx })
}

uaBrowser.isWebview = isWebview
uaBrowser.getLanguage = (): string => getLanguage(getNavContext())
uaBrowser.VERSION = VERSION

export default uaBrowser
