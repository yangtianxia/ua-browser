import { BOT_DEFS, type BotName } from '../constants/bots.js'

export interface BotResult {
  isBot: boolean
  botName: BotName
}

/**
 * Detect whether the UA belongs to a bot, crawler, or spider.
 * Returns the specific bot name when recognised, 'GenericBot' for generic patterns,
 * or 'unknown' for regular user agents.
 */
export function detectBot(ua: string): BotResult {
  for (const def of BOT_DEFS) {
    if (def.detect.test(ua)) {
      return { isBot: true, botName: def.name }
    }
  }
  return { isBot: false, botName: 'unknown' }
}
