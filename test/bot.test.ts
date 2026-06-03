import { describe, it, expect } from 'vitest'
import { detectBot } from '../src/detectors/bot.js'
import { UA } from './fixtures/user-agents.js'

describe('detectBot', () => {
  describe('known bots', () => {
    it('detects Googlebot', () => {
      const ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Googlebot')
    })

    it('detects Bingbot', () => {
      const ua = 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Bingbot')
    })

    it('detects Baiduspider', () => {
      const ua = 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Baiduspider')
    })

    it('detects Bytespider (ByteDance)', () => {
      const ua = 'Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Bytespider')
    })

    it('detects YandexBot', () => {
      const ua = 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('YandexBot')
    })

    it('detects Facebookbot', () => {
      const ua = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Facebookbot')
    })

    it('detects Twitterbot', () => {
      const ua = 'Twitterbot/1.0'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Twitterbot')
    })

    it('detects AhrefsBot', () => {
      const ua = 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('AhrefsBot')
    })

    it('detects GPTBot', () => {
      const ua = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('GPTBot')
    })

    it('detects ClaudeBot', () => {
      const ua = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/0.1; +claudebot@anthropic.com'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('ClaudeBot')
    })

    it('detects PerplexityBot', () => {
      const ua = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://docs.perplexity.ai/docs/perplexitybot'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('PerplexityBot')
    })

    it('detects CCBot (Common Crawl)', () => {
      const ua = 'CCBot/2.0 (https://commoncrawl.org/faq/)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('CCBot')
    })

    it('detects AdsBot-Google', () => {
      const ua = 'AdsBot-Google (+http://www.google.com/adsbot.html)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('AdsBot')
    })

    it('detects Applebot-Extended (before Applebot)', () => {
      const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 (Applebot-Extended/0.1; +http://www.apple.com/go/applebot)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Applebot-Extended')
    })

    it('detects OAI-SearchBot', () => {
      const ua = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('OAI-SearchBot')
    })

    it('detects ChatGPT-User', () => {
      const ua = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('ChatGPT-User')
    })

    it('detects Meta-ExternalAgent', () => {
      const ua = 'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Meta-ExternalAgent')
    })

    it('detects Amazonbot', () => {
      const ua = 'Mozilla/5.0 (compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Amazonbot')
    })

    it('detects Diffbot', () => {
      const ua = 'Mozilla/5.0 (compatible; Diffbot/0.1; +https://www.diffbot.com)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Diffbot')
    })

    it('detects cohere-ai', () => {
      const ua = 'cohere-ai/1.0'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('cohere-ai')
    })

    it('detects YouBot', () => {
      const ua = 'Mozilla/5.0 (compatible; YouBot/1.0; +https://you.com/youbot)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('YouBot')
    })

    it('detects Google-Extended', () => {
      const ua = 'Mozilla/5.0 (compatible; Google-Extended)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('Google-Extended')
    })

    it('detects generic bot by keyword', () => {
      const ua = 'MyCustomCrawler/1.0 (a custom web crawler)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('GenericBot')
    })
  })

  describe('customBotDefs', () => {
    it('detects custom bot injected via customDefs', () => {
      const ua = 'MyInternalScraper/2.0'
      const customDefs = [{ name: 'GenericBot' as const, detect: /MyInternalScraper/ }]
      const r = detectBot(ua, customDefs)
      expect(r.isBot).toBe(true)
    })

    it('custom bot does not shadow GenericBot catch-all for unmatched UA', () => {
      const ua = 'some-unknown-crawler'
      const customDefs = [{ name: 'GenericBot' as const, detect: /MyInternalScraper/ }]
      const r = detectBot(ua, customDefs)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('GenericBot')
    })

    it('without customDefs, custom UA returns unknown', () => {
      const ua = 'MyInternalFetcher/2.0'
      const r = detectBot(ua)
      expect(r.isBot).toBe(false)
      expect(r.botName).toBe('unknown')
    })
  })

  describe('regular browsers', () => {
    it('Chrome on Windows is not a bot', () => {
      const r = detectBot(UA.chrome.windows)
      expect(r.isBot).toBe(false)
      expect(r.botName).toBe('unknown')
    })

    it('Safari on iOS is not a bot', () => {
      expect(detectBot(UA.safari.ios).isBot).toBe(false)
    })

    it('WeChat is not a bot', () => {
      expect(detectBot(UA.wechat.mobile).isBot).toBe(false)
    })

    it('empty UA is not a bot', () => {
      expect(detectBot('').isBot).toBe(false)
    })
  })
})
