import { describe, it, expect } from 'vitest'
import { detectBrowser } from '../src/detectors/browser.js'
import { UA } from './fixtures/user-agents.js'

describe('detectBrowser', () => {
  describe('standard browsers', () => {
    it('detects Chrome on Windows', () => {
      const r = detectBrowser(UA.chrome.windows)
      expect(r.browser).toBe('Chrome')
      expect(r.version).toBe('124.0.0.0')
    })

    it('detects Chrome iOS (CriOS)', () => {
      const r = detectBrowser(UA.chrome.crios)
      expect(r.browser).toBe('Chrome')
      expect(r.version).toBe('124.0.6367.88')
    })

    it('detects Chrome iOS 26 (CriOS)', () => {
      const r = detectBrowser(UA.chrome.crios26)
      expect(r.browser).toBe('Chrome')
      expect(r.version).toBe('147.0.7727.99')
    })

    it('detects Edge Chromium', () => {
      const r = detectBrowser(UA.edge.chromium)
      expect(r.browser).toBe('Edge')
      expect(r.version).toBe('124.0.0.0')
    })

    it('detects Edge legacy', () => {
      const r = detectBrowser(UA.edge.legacy)
      expect(r.browser).toBe('Edge')
      expect(r.version).toBe('13.10586')
    })

    it('detects Edge iOS', () => {
      const r = detectBrowser(UA.edge.ios)
      expect(r.browser).toBe('Edge')
      expect(r.version).toBe('124.0.0.0')
    })

    it('detects Edge Android', () => {
      const r = detectBrowser(UA.edge.android)
      expect(r.browser).toBe('Edge')
      expect(r.version).toBe('124.0.0.0')
    })

    it('detects Firefox desktop', () => {
      const r = detectBrowser(UA.firefox.desktop)
      expect(r.browser).toBe('Firefox')
      expect(r.version).toBe('125.0')
    })

    it('detects Firefox iOS (FxiOS)', () => {
      const r = detectBrowser(UA.firefox.ios)
      expect(r.browser).toBe('Firefox')
      expect(r.version).toBe('125.0')
    })

    it('detects Firefox Focus', () => {
      const r = detectBrowser(UA.firefox.focus)
      expect(r.browser).toBe('Firefox Focus')
      expect(r.version).toBe('121.0')
    })

    it('detects Safari desktop', () => {
      const r = detectBrowser(UA.safari.desktop)
      expect(r.browser).toBe('Safari')
      expect(r.version).toBe('17.3')
    })

    it('detects Safari iOS', () => {
      const r = detectBrowser(UA.safari.ios)
      expect(r.browser).toBe('Safari')
      expect(r.version).toBe('17.4')
    })

    it('detects Safari iOS 26 (decoupled version)', () => {
      const r = detectBrowser(UA.safari.ios26)
      expect(r.browser).toBe('Safari')
      expect(r.version).toBe('26.4')
    })

    it('detects IE11', () => {
      const r = detectBrowser(UA.ie.ie11)
      expect(r.browser).toBe('IE')
      expect(r.version).toBe('11.0')
    })

    it('detects IE9', () => {
      const r = detectBrowser(UA.ie.ie9)
      expect(r.browser).toBe('IE')
      expect(r.version).toBe('9.0')
    })

    it('detects Opera modern', () => {
      const r = detectBrowser(UA.opera.modern)
      expect(r.browser).toBe('Opera')
      expect(r.version).toBe('110.0.0.0')
    })
  })

  describe('Chinese / app browsers', () => {
    it('detects WeChat', () => {
      const r = detectBrowser(UA.wechat.mobile)
      expect(r.browser).toBe('Wechat')
      expect(r.version).toBe('8.0.37.2380')
    })

    it('detects WechatWork over Wechat', () => {
      const r = detectBrowser(UA.wechatWork.mobile)
      expect(r.browser).toBe('WechatWork')
      expect(r.version).toBe('4.1.2')
    })

    it('detects QQBrowser', () => {
      const r = detectBrowser(UA.qq.mobile)
      expect(r.browser).toBe('QQBrowser')
      expect(r.version).toBe('13.4.5.5055')
    })

    it('detects UC Browser', () => {
      const r = detectBrowser(UA.uc.mobile)
      expect(r.browser).toBe('UC')
      expect(r.version).toBe('13.4.2.1306')
    })

    it('detects Baidu box app', () => {
      const r = detectBrowser(UA.baidu.mobile)
      expect(r.browser).toBe('Baidu')
      expect(r.version).toBe('12.19.0.10')
    })

    it('detects DingTalk', () => {
      const r = detectBrowser(UA.dingtalk.mobile)
      expect(r.browser).toBe('DingTalk')
      expect(r.version).toBe('6.0.30')
    })

    it('detects 360SE with Chrome lookup', () => {
      const r = detectBrowser(UA['360se'].desktop)
      expect(r.browser).toBe('360SE')
      expect(r.version).toBe('12.0') // Chrome 78 → 12.0
    })

    it('detects 360EE with Chrome lookup', () => {
      const r = detectBrowser(UA['360ee'].desktop)
      expect(r.browser).toBe('360EE')
      expect(r.version).toBe('12.0') // Chrome 78 → 12.0
    })

    it('detects Taobao', () => {
      const r = detectBrowser(UA.taobao.mobile)
      expect(r.browser).toBe('Taobao')
      expect(r.version).toBe('10.10.0')
    })

    it('detects Alipay', () => {
      const r = detectBrowser(UA.alipay.mobile)
      expect(r.browser).toBe('Alipay')
      expect(r.version).toBe('10.3.20')
    })

    it('detects Douyin', () => {
      const r = detectBrowser(UA.douyin.mobile)
      expect(r.browser).toBe('Douyin')
      expect(r.version).toBe('20.6.0')
    })

    it('detects Bilibili', () => {
      const r = detectBrowser(UA.bilibili.mobile)
      expect(r.browser).toBe('Bilibili')
      expect(r.version).toBe('6.24.0')
    })

    it('detects Kuaishou', () => {
      const r = detectBrowser(UA.kuaishou.mobile)
      expect(r.browser).toBe('Kuaishou')
      expect(r.version).toBe('10.2.40.5370')
    })

    it('detects Xiaohongshu', () => {
      const r = detectBrowser(UA.xiaohongshu.mobile)
      expect(r.browser).toBe('Xiaohongshu')
      expect(r.version).toBe('7.51.1')
    })

    it('detects Feishu (Lark token)', () => {
      const r = detectBrowser(UA.feishu.mobile)
      expect(r.browser).toBe('Feishu')
      expect(r.version).toBe('6.8.9')
    })

    it('detects Toutiao', () => {
      const r = detectBrowser(UA.toutiao.mobile)
      expect(r.browser).toBe('Toutiao')
      expect(r.version).toBe('8.7.5')
    })

    it('detects JD', () => {
      const r = detectBrowser(UA.jd.mobile)
      expect(r.browser).toBe('JD')
      expect(r.version).toBe('3.5.0')
    })

    it('detects Meituan', () => {
      const r = detectBrowser(UA.meituan.mobile)
      expect(r.browser).toBe('Meituan')
      expect(r.version).toBe('1.0')
    })
  })

  describe('international browsers', () => {
    it('detects Samsung Internet', () => {
      const r = detectBrowser(UA.samsungInternet.mobile)
      expect(r.browser).toBe('Samsung Internet')
      expect(r.version).toBe('24.0')
    })

    it('detects DuckDuckGo Browser on iOS', () => {
      const r = detectBrowser(UA.duckduckgo.ios)
      expect(r.browser).toBe('DuckDuckGo')
      expect(r.version).toBe('7')
    })

    it('detects DuckDuckGo Browser on Android', () => {
      const r = detectBrowser(UA.duckduckgo.android)
      expect(r.browser).toBe('DuckDuckGo')
      expect(r.version).toBe('5')
    })

    it('detects Puffin', () => {
      const r = detectBrowser(UA.puffin.android)
      expect(r.browser).toBe('Puffin')
      expect(r.version).toBe('9.7.2.51166')
    })
  })

  describe('priority disambiguation', () => {
    it('Edge UA is detected as Edge, not Chrome', () => {
      expect(detectBrowser(UA.edge.chromium).browser).toBe('Edge')
    })

    it('WeChat UA is detected as Wechat, not Chrome', () => {
      expect(detectBrowser(UA.wechat.mobile).browser).toBe('Wechat')
    })
  })

  describe('version correctness', () => {
    it('version is never the raw UA string', () => {
      const testCases = Object.values(UA).flatMap((group) =>
        typeof group === 'string' ? [group] : Object.values(group)
      )
      for (const ua of testCases) {
        const { version } = detectBrowser(ua)
        expect(version).not.toBe(ua)
      }
    })
  })

  describe('edge cases', () => {
    it('returns unknown for empty UA', () => {
      const r = detectBrowser('')
      expect(r.browser).toBe('unknown')
      expect(r.version).toBe('unknown')
    })

    it('returns unknown browser for non-browser UA', () => {
      const r = detectBrowser(UA.node)
      expect(r.browser).toBe('unknown')
    })
  })
})
