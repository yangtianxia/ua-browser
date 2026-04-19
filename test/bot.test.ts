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

    it('detects generic bot by keyword', () => {
      const ua = 'MyCustomCrawler/1.0 (a custom web crawler)'
      const r = detectBot(ua)
      expect(r.isBot).toBe(true)
      expect(r.botName).toBe('GenericBot')
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
