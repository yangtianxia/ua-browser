export type BotName =
  | 'Googlebot'
  | 'Bingbot'
  | 'Baiduspider'
  | 'Bytespider'
  | 'YandexBot'
  | 'DuckDuckBot'
  | 'Slurp'
  | 'Sogou'
  | '360Spider'
  | 'Applebot'
  | 'Facebookbot'
  | 'Twitterbot'
  | 'LinkedInBot'
  | 'SemrushBot'
  | 'AhrefsBot'
  | 'MJ12bot'
  | 'PetalBot'
  | 'GPTBot'
  | 'ClaudeBot'
  | 'PerplexityBot'
  | 'CCBot'
  | 'AdsBot'
  | 'GenericBot'
  | 'unknown'

export interface BotDef {
  name: BotName
  detect: RegExp
}

export const BOT_DEFS: readonly BotDef[] = [
  // Search engines
  { name: 'Googlebot',   detect: /Googlebot/ },
  { name: 'Bingbot',     detect: /(bingbot|BingPreview)/ },
  { name: 'Baiduspider', detect: /(Baiduspider|BaiduMobaider)/ },
  { name: 'Bytespider',  detect: /Bytespider/ },
  { name: 'YandexBot',   detect: /YandexBot/ },
  { name: 'DuckDuckBot', detect: /DuckDuckBot/ },
  { name: 'Slurp',       detect: /Slurp/ },
  { name: 'Sogou',       detect: /(Sogou|sogou).*[Ss]pider/ },
  { name: '360Spider',   detect: /360Spider/ },
  { name: 'PetalBot',    detect: /PetalBot/ },
  { name: 'Applebot',    detect: /Applebot/ },
  // Social
  { name: 'Facebookbot', detect: /(facebookexternalhit|FacebookBot)/ },
  { name: 'Twitterbot',  detect: /Twitterbot/ },
  { name: 'LinkedInBot', detect: /LinkedInBot/ },
  // SEO tools
  { name: 'SemrushBot',    detect: /SemrushBot/ },
  { name: 'AhrefsBot',     detect: /AhrefsBot/ },
  { name: 'MJ12bot',       detect: /MJ12bot/ },
  // AI / LLM crawlers
  { name: 'GPTBot',        detect: /GPTBot/ },
  { name: 'ClaudeBot',     detect: /ClaudeBot/ },
  { name: 'PerplexityBot', detect: /PerplexityBot/ },
  { name: 'CCBot',         detect: /CCBot/ },
  { name: 'AdsBot',        detect: /AdsBot-Google/ },
  // Generic catch-all (must be last)
  { name: 'GenericBot',    detect: /(bot|crawler|spider|crawling|scraper)/i }
] as const
