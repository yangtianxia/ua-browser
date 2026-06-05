import type { BotCategory } from '../types.js'

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
  name:     BotName
  detect:   RegExp
  category: BotCategory
}

export const BOT_DEFS: readonly BotDef[] = [
  // Search engines
  { name: 'Googlebot',          detect: /Googlebot/,                        category: 'search-engine' },
  { name: 'Bingbot',            detect: /(bingbot|BingPreview)/,            category: 'search-engine' },
  { name: 'Baiduspider',        detect: /(Baiduspider|BaiduMobaider)/,      category: 'search-engine' },
  { name: 'Bytespider',         detect: /Bytespider/,                       category: 'search-engine' },
  { name: 'YandexBot',          detect: /YandexBot/,                        category: 'search-engine' },
  { name: 'DuckDuckBot',        detect: /DuckDuckBot/,                      category: 'search-engine' },
  { name: 'Slurp',              detect: /Slurp/,                            category: 'search-engine' },
  { name: 'Sogou',              detect: /(Sogou|sogou).*[Ss]pider/,         category: 'search-engine' },
  { name: '360Spider',          detect: /360Spider/,                        category: 'search-engine' },
  { name: 'PetalBot',           detect: /PetalBot/,                         category: 'search-engine' },
  { name: 'Applebot-Extended',  detect: /Applebot-Extended/,                category: 'search-engine' },
  { name: 'Applebot',           detect: /Applebot/,                         category: 'search-engine' },
  // Social media crawlers
  { name: 'Facebookbot',        detect: /(facebookexternalhit|FacebookBot)/, category: 'social' },
  { name: 'Twitterbot',         detect: /Twitterbot/,                        category: 'social' },
  { name: 'LinkedInBot',        detect: /LinkedInBot/,                       category: 'social' },
  { name: 'PinterestBot',       detect: /Pinterest/,                         category: 'social' },
  // Messaging link preview bots
  { name: 'Slackbot',           detect: /Slackbot/,                         category: 'link-preview' },
  { name: 'Discordbot',         detect: /Discordbot/,                       category: 'link-preview' },
  { name: 'TelegramBot',        detect: /TelegramBot/,                      category: 'link-preview' },
  { name: 'WhatsApp',           detect: /WhatsApp/,                         category: 'link-preview' },
  // SEO tools
  { name: 'SemrushBot',         detect: /SemrushBot/,                       category: 'seo-tool' },
  { name: 'AhrefsBot',          detect: /AhrefsBot/,                        category: 'seo-tool' },
  { name: 'MJ12bot',            detect: /MJ12bot/,                          category: 'seo-tool' },
  { name: 'ScreamingFrog',      detect: /Screaming Frog/,                   category: 'seo-tool' },
  { name: 'DataForSeoBot',      detect: /DataForSeoBot/,                    category: 'seo-tool' },
  // AI / LLM crawlers
  { name: 'GPTBot',             detect: /GPTBot/,                           category: 'ai-llm' },
  { name: 'OAI-SearchBot',      detect: /OAI-SearchBot/,                    category: 'ai-llm' },
  { name: 'ChatGPT-User',       detect: /ChatGPT-User/,                     category: 'ai-llm' },
  { name: 'ClaudeBot',          detect: /ClaudeBot/,                        category: 'ai-llm' },
  { name: 'PerplexityBot',      detect: /PerplexityBot/,                    category: 'ai-llm' },
  { name: 'CCBot',              detect: /CCBot/,                            category: 'ai-llm' },
  { name: 'AdsBot',             detect: /AdsBot-Google/,                    category: 'ai-llm' },
  { name: 'Google-Extended',    detect: /Google-Extended/,                  category: 'ai-llm' },
  { name: 'Meta-ExternalAgent', detect: /meta-externalagent/i,              category: 'ai-llm' },
  { name: 'Amazonbot',          detect: /Amazonbot/,                        category: 'ai-llm' },
  { name: 'Diffbot',            detect: /Diffbot/,                          category: 'ai-llm' },
  { name: 'cohere-ai',          detect: /cohere-ai/,                        category: 'ai-llm' },
  { name: 'YouBot',             detect: /YouBot/,                           category: 'ai-llm' },
  // Monitoring / archiving
  { name: 'UptimeRobot',        detect: /UptimeRobot/,                      category: 'monitoring' },
  { name: 'ia_archiver',        detect: /ia_archiver/,                      category: 'monitoring' },
  // Generic catch-all (must be last)
  { name: 'GenericBot',         detect: /(bot|crawler|spider|crawling|scraper)/i, category: 'generic' },
] as const
