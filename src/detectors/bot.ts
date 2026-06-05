import { BOT_DEFS, type BotDef, type BotName } from '../constants/bots.js'
import type { BotCategory } from '../types.js'

export type { BotDef }

export interface BotResult {
  isBot:       boolean
  botName:     BotName
  botCategory: BotCategory
}

/**
 * Detect whether the UA belongs to a bot, crawler, or spider.
 * Returns the specific bot name when recognised, 'GenericBot' for generic patterns,
 * or 'unknown' for regular user agents.
 *
 * Pass `customDefs` to prepend project-specific bot rules before the GenericBot catch-all.
 */
export function detectBot(ua: string, customDefs?: readonly BotDef[]): BotResult {
  const defs = customDefs
    ? [...BOT_DEFS.slice(0, -1), ...customDefs, BOT_DEFS[BOT_DEFS.length - 1]!]
    : BOT_DEFS
  for (const def of defs) {
    if (def.detect.test(ua)) {
      return { isBot: true, botName: def.name, botCategory: def.category }
    }
  }
  return { isBot: false, botName: 'unknown', botCategory: 'unknown' }
}
