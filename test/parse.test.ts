import { describe, it, expect } from 'vitest'
import { parseUA } from '../src/parse.js'
import { UA } from './fixtures/user-agents.js'

describe('parseUA — return shape', () => {
  it('returns all required keys', () => {
    const result = parseUA(UA.chrome.windows)
    const keys: Array<keyof typeof result> = [
      'browser', 'version', 'engine', 'os', 'osVersion',
      'device', 'arch', 'isWebview', 'isHeadless', 'isBot', 'botName',
      'language', 'platform'
    ]
    for (const key of keys) {
      expect(result).toHaveProperty(key)
    }
  })

  it('does NOT contain the old "platfrom" typo key', () => {
    const result = parseUA(UA.chrome.windows) as Record<string, unknown>
    expect(result).not.toHaveProperty('platfrom')
  })

  it('does NOT contain the old "languge" typo key', () => {
    const result = parseUA(UA.chrome.windows) as Record<string, unknown>
    expect(result).not.toHaveProperty('languge')
  })
})

describe('parseUA — full pipeline', () => {
  it('Chrome on Windows', () => {
    const r = parseUA(UA.chrome.windows)
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('10')
    expect(r.engine).toBe('Blink')
    expect(r.device).toBe('PC')
    expect(r.isWebview).toBe(false)
  })

  it('Chrome on Android mobile', () => {
    const r = parseUA(UA.chrome.android)
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('Android')
    expect(r.engine).toBe('Blink')
    expect(r.device).toBe('Mobile')
  })

  it('Safari on iPhone', () => {
    const r = parseUA(UA.safari.ios)
    expect(r.browser).toBe('Safari')
    expect(r.os).toBe('iOS')
    expect(r.osVersion).toBe('17.4')
    expect(r.engine).toBe('WebKit')
    expect(r.device).toBe('Mobile')
  })

  it('Safari on iOS 26 — CPU iPhone OS frozen at 18_7, Version/ reflects real version', () => {
    const r = parseUA(UA.safari.ios26)
    expect(r.browser).toBe('Safari')
    expect(r.version).toBe('26.4')
    expect(r.os).toBe('iOS')
    expect(r.osVersion).toBe('26.4')
    expect(r.engine).toBe('WebKit')
    expect(r.device).toBe('Mobile')
  })

  it('Chrome on iOS 26 — CriOS reports real OS version', () => {
    const r = parseUA(UA.chrome.crios26)
    expect(r.browser).toBe('Chrome')
    expect(r.version).toBe('147.0.7727.99')
    expect(r.os).toBe('iOS')
    expect(r.osVersion).toBe('26.4.2')
    expect(r.engine).toBe('WebKit')
    expect(r.device).toBe('Mobile')
  })

  it('Edge Chromium on Windows', () => {
    const r = parseUA(UA.edge.chromium)
    expect(r.browser).toBe('Edge')
    expect(r.engine).toBe('Blink')
    expect(r.os).toBe('Windows')
  })

  it('Edge legacy on Windows', () => {
    const r = parseUA(UA.edge.legacy)
    expect(r.browser).toBe('Edge')
    expect(r.engine).toBe('EdgeHTML')
  })

  it('Firefox on Windows', () => {
    const r = parseUA(UA.firefox.desktop)
    expect(r.browser).toBe('Firefox')
    expect(r.engine).toBe('Gecko')
    expect(r.os).toBe('Windows')
  })

  it('IE11 on Windows 7', () => {
    const r = parseUA(UA.ie.ie11)
    expect(r.browser).toBe('IE')
    expect(r.engine).toBe('Trident')
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('7')
  })

  it('WeChat mobile', () => {
    const r = parseUA(UA.wechat.mobile)
    expect(r.browser).toBe('Wechat')
    expect(r.os).toBe('Android')
  })

  it('DuckDuckGo on iOS — not mis-detected as Safari despite Version/ and Safari/ in UA', () => {
    const r = parseUA(UA.duckduckgo.ios)
    expect(r.browser).toBe('DuckDuckGo')
    expect(r.version).toBe('7')
    expect(r.os).toBe('iOS')
    expect(r.engine).toBe('WebKit')
  })

  it('DuckDuckGo v26+ on iOS (Ddg/ token) — not mis-detected as Safari', () => {
    const r = parseUA(UA.duckduckgo.iosDdg)
    expect(r.browser).toBe('DuckDuckGo')
    expect(r.version).toBe('26.4')
    expect(r.os).toBe('iOS')
    expect(r.engine).toBe('WebKit')
  })

  it('DuckDuckGo on Android — not mis-detected as Chrome despite Chrome/ in UA', () => {
    const r = parseUA(UA.duckduckgo.android)
    expect(r.browser).toBe('DuckDuckGo')
    expect(r.version).toBe('5')
    expect(r.os).toBe('Android')
  })

  it('DingTalk mobile', () => {
    const r = parseUA(UA.dingtalk.mobile)
    expect(r.browser).toBe('DingTalk')
    expect(r.os).toBe('Android')
  })

  it('HarmonyOS legacy — Huawei browser on HarmonyOS', () => {
    const r = parseUA(UA.harmonyOs.legacy)
    expect(r.browser).toBe('Huawei')
    expect(r.os).toBe('HarmonyOS')
    expect(r.engine).toBe('Blink')
  })

  it('HarmonyOS Next — Chrome on HarmonyOS (no HuaweiBrowser token)', () => {
    const r = parseUA(UA.harmonyOs.next)
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('HarmonyOS')
    expect(r.engine).toBe('Blink')
  })

  it('HarmonyOS ArkWeb — Chrome on HarmonyOS with ArkWeb engine', () => {
    const r = parseUA(UA.harmonyOs.arkWeb)
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('HarmonyOS')
    expect(r.engine).toBe('ArkWeb')
  })
})

describe('parseUA — webview detection', () => {
  it('Android ; wv → isWebview: true', () => {
    expect(parseUA(UA.webview.android).isWebview).toBe(true)
  })

  it('iOS WKWebView (no Version/, no Safari/) → isWebview: true', () => {
    expect(parseUA(UA.webview.iosWKWebView).isWebview).toBe(true)
  })

  it('iOS Safari (has Version/ and Safari/) → isWebview: false', () => {
    expect(parseUA(UA.safari.ios).isWebview).toBe(false)
  })

  it('CriOS on iOS (has Safari/) → isWebview: false', () => {
    expect(parseUA(UA.chrome.crios).isWebview).toBe(false)
  })

  it('no ; wv → isWebview: false', () => {
    expect(parseUA(UA.chrome.android).isWebview).toBe(false)
  })
})

describe('parseUA — windowsVersion override', () => {
  it('applies provided windowsVersion string', () => {
    const r = parseUA(UA.chrome.windows, { windowsVersion: '11' })
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('11')
  })
})

describe('parseUA — ctx option', () => {
  it('ctx.windowsVersion supersedes options.windowsVersion', () => {
    const ctx = { userAgent: UA.chrome.windows, platform: 'Win32', language: 'en-US',
      maxTouchPoints: 0, windowsVersion: '11' }
    const r = parseUA(UA.chrome.windows, { ctx, windowsVersion: '10' })
    expect(r.osVersion).toBe('11')
  })

  it('ctx.highEntropyData.architecture used for arch detection', () => {
    const ctx = { userAgent: UA.safari.ios, platform: 'iPhone', language: 'en',
      maxTouchPoints: 5, highEntropyData: { architecture: 'arm', bitness: '64' } }
    const r = parseUA(UA.safari.ios, { ctx })
    expect(r.arch).toBe('arm64')
  })

  it('ctx platform used as result.platform', () => {
    const ctx = { userAgent: UA.chrome.windows, platform: 'Win32', language: 'en-US', maxTouchPoints: 0 }
    const r = parseUA(UA.chrome.windows, { ctx })
    expect(r.platform).toBe('Win32')
  })
})

describe('parseUA — new fields (arch, isBot, isHeadless)', () => {
  it('Windows x64 Chrome → arch: x86_64', () => {
    expect(parseUA(UA.chrome.windows).arch).toBe('x86_64')
  })

  it('regular Chrome → isBot: false, botName: unknown', () => {
    const r = parseUA(UA.chrome.windows)
    expect(r.isBot).toBe(false)
    expect(r.botName).toBe('unknown')
  })

  it('Googlebot UA → isBot: true, botName: Googlebot', () => {
    const r = parseUA('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
    expect(r.isBot).toBe(true)
    expect(r.botName).toBe('Googlebot')
  })

  it('normal Chrome → isHeadless: false', () => {
    expect(parseUA(UA.chrome.windows).isHeadless).toBe(false)
  })

  it('HeadlessChrome UA → isHeadless: true', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/124.0.0.0 Safari/537.36'
    expect(parseUA(ua).isHeadless).toBe(true)
  })
})

describe('parseUA — confidence field', () => {
  it('no ctx → confidence: low', () => {
    const r = parseUA(UA.chrome.windows)
    expect(r.confidence).toBe('low')
  })

  it('ctx without fullVersionList → confidence: medium', () => {
    const ctx = { userAgent: UA.chrome.windows, platform: 'Win32', language: 'en-US', maxTouchPoints: 0 }
    const r = parseUA(UA.chrome.windows, { ctx })
    expect(r.confidence).toBe('medium')
  })

  it('ctx with fullVersionList for Chrome → confidence: high, precise version used', () => {
    const ctx = {
      userAgent: UA.chrome.windows, platform: 'Win32', language: 'en-US', maxTouchPoints: 0,
      highEntropyData: {
        fullVersionList: [
          { brand: 'Not)A;Brand', version: '99.0.0.0' },
          { brand: 'Chromium', version: '124.0.6367.201' },
          { brand: 'Google Chrome', version: '124.0.6367.201' },
        ]
      }
    }
    const r = parseUA(UA.chrome.windows, { ctx })
    expect(r.confidence).toBe('high')
    expect(r.version).toBe('124.0.6367.201')
  })

  it('ctx with fullVersionList for Edge → confidence: high, brand version used', () => {
    const edgeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
    const ctx = {
      userAgent: edgeUA, platform: 'Win32', language: 'en-US', maxTouchPoints: 0,
      highEntropyData: {
        fullVersionList: [
          { brand: 'Microsoft Edge', version: '124.0.2478.97' },
          { brand: 'Chromium', version: '124.0.6367.201' },
        ]
      }
    }
    const r = parseUA(edgeUA, { ctx })
    expect(r.confidence).toBe('high')
    expect(r.version).toBe('124.0.2478.97')
  })

  it('ctx with fullVersionList for non-mapped browser (Firefox) → confidence: medium', () => {
    const ctx = {
      userAgent: UA.firefox.desktop, platform: 'Win32', language: 'en-US', maxTouchPoints: 0,
      highEntropyData: { fullVersionList: [{ brand: 'Not)A;Brand', version: '99' }] }
    }
    const r = parseUA(UA.firefox.desktop, { ctx })
    expect(r.confidence).toBe('medium')
  })
})

describe('parseUA — customBotDefs', () => {
  it('detects custom bot via parseUA customBotDefs option', () => {
    const ua = 'MyCompanyBot/1.0'
    const r = parseUA(ua, { customBotDefs: [{ name: 'GenericBot', detect: /MyCompanyBot/ }] })
    expect(r.isBot).toBe(true)
  })
})

describe('parseUA — edge cases', () => {
  it('empty UA → all unknowns', () => {
    const r = parseUA('')
    expect(r.browser).toBe('unknown')
    expect(r.os).toBe('unknown')
    expect(r.engine).toBe('unknown')
  })

  it('iPad UA with safari string → Tablet device', () => {
    const r = parseUA(UA.safari.ipad)
    expect(r.device).toBe('Tablet')
    expect(r.os).toBe('iOS')
  })
})
