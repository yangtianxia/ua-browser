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
  | 'Applebot-Extended'
  | 'Applebot'
  | 'Facebookbot'
  | 'Twitterbot'
  | 'LinkedInBot'
  | 'PinterestBot'
  | 'Slackbot'
  | 'Discordbot'
  | 'TelegramBot'
  | 'WhatsApp'
  | 'SemrushBot'
  | 'AhrefsBot'
  | 'MJ12bot'
  | 'PetalBot'
  | 'ScreamingFrog'
  | 'DataForSeoBot'
  | 'GPTBot'
  | 'OAI-SearchBot'
  | 'ChatGPT-User'
  | 'ClaudeBot'
  | 'PerplexityBot'
  | 'CCBot'
  | 'AdsBot'
  | 'Google-Extended'
  | 'Meta-ExternalAgent'
  | 'Amazonbot'
  | 'Diffbot'
  | 'cohere-ai'
  | 'YouBot'
  | 'UptimeRobot'
  | 'ia_archiver'
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
  { name: 'Applebot-Extended', detect: /Applebot-Extended/ },
  { name: 'Applebot',    detect: /Applebot/ },
  // Social media crawlers
  { name: 'Facebookbot',  detect: /(facebookexternalhit|FacebookBot)/ },
  { name: 'Twitterbot',   detect: /Twitterbot/ },
  { name: 'LinkedInBot',  detect: /LinkedInBot/ },
  { name: 'PinterestBot', detect: /Pinterest/ },
  // Messaging link preview bots
  { name: 'Slackbot',    detect: /Slackbot/ },
  { name: 'Discordbot',  detect: /Discordbot/ },
  { name: 'TelegramBot', detect: /TelegramBot/ },
  { name: 'WhatsApp',    detect: /WhatsApp/ },
  // SEO tools
  { name: 'SemrushBot',    detect: /SemrushBot/ },
  { name: 'AhrefsBot',     detect: /AhrefsBot/ },
  { name: 'MJ12bot',       detect: /MJ12bot/ },
  { name: 'ScreamingFrog', detect: /Screaming Frog/ },
  { name: 'DataForSeoBot', detect: /DataForSeoBot/ },
  // AI / LLM crawlers
  { name: 'GPTBot',             detect: /GPTBot/ },
  { name: 'OAI-SearchBot',      detect: /OAI-SearchBot/ },
  { name: 'ChatGPT-User',       detect: /ChatGPT-User/ },
  { name: 'ClaudeBot',          detect: /ClaudeBot/ },
  { name: 'PerplexityBot',      detect: /PerplexityBot/ },
  { name: 'CCBot',              detect: /CCBot/ },
  { name: 'AdsBot',             detect: /AdsBot-Google/ },
  { name: 'Google-Extended',    detect: /Google-Extended/ },
  { name: 'Meta-ExternalAgent', detect: /meta-externalagent/i },
  { name: 'Amazonbot',          detect: /Amazonbot/ },
  { name: 'Diffbot',            detect: /Diffbot/ },
  { name: 'cohere-ai',          detect: /cohere-ai/ },
  { name: 'YouBot',             detect: /YouBot/ },
  // Monitoring / archiving
  { name: 'UptimeRobot', detect: /UptimeRobot/ },
  { name: 'ia_archiver', detect: /ia_archiver/ },
  // Generic catch-all (must be last)
  { name: 'GenericBot', detect: /(bot|crawler|spider|crawling|scraper)/i },
] as const
