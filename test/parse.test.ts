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

  it('Safari on macOS 26 — UA freezes Mac OS X at 10_15_7, Version/ reflects real macOS version', () => {
    const r = parseUA(UA.safari.mac26)
    expect(r.browser).toBe('Safari')
    expect(r.version).toBe('26.3.1')
    expect(r.os).toBe('MacOS')
    expect(r.osVersion).toBe('26.3.1')
    expect(r.engine).toBe('WebKit')
    expect(r.device).toBe('PC')
  })

  it('Safari on macOS 17 — Version/17.x does NOT override osVersion (no unified versioning before 26)', () => {
    const r = parseUA(UA.safari.desktop) // Version/17.3, Mac OS X 14_3
    expect(r.os).toBe('MacOS')
    expect(r.osVersion).toBe('14.3') // real macOS version from UA, not Safari version
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

describe('parseUA — hardware context (ctx)', () => {
  // Simulates a MacBook Chrome with DevTools Android emulation active.
  // DevTools spoofs: navigator.userAgent, userAgentData.platform, maxTouchPoints.
  // DevTools does NOT spoof: navigator.platform (stays 'MacIntel'), WebGL renderer.
  const androidSpoofedUA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'

  const macIntelCtx = {
    userAgent: androidSpoofedUA,
    platform: 'MacIntel',
    language: 'en-US',
    maxTouchPoints: 5,
    userAgentData: {
      platform: 'Android',
      getHighEntropyValues: async (_: string[]) => ({} as Record<string, string>),
    },
    webglRenderer: 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1 Pro, unspecified version)',
    screenWidth: 390,
  }

  it('ctx: OS from hardware platform, device from ANGLE renderer', () => {
    const r = parseUA(androidSpoofedUA, { ctx: macIntelCtx })
    expect(r.os).toBe('MacOS')
    expect(r.device).toBe('PC')
    expect(r.osVersion).toBe('unknown')
  })

  it('ctx: ANGLE renderer blocks DevTools iOS platform spoof — OS falls back to UA', () => {
    // DevTools iOS emulation sets navigator.platform to 'iPhone' and userAgentData.platform
    // to 'iOS', but cannot fake the WebGL ANGLE renderer (which reveals the real desktop GPU).
    // osFromHardware detects ANGLE and cannot confirm Mac/Win → returns null → UA wins.
    const ctx = {
      ...macIntelCtx,
      platform: 'iPhone',
      userAgentData: { platform: 'iOS', getHighEntropyValues: async (_: string[]) => ({} as Record<string, string>) },
    }
    const r = parseUA(androidSpoofedUA, { ctx })
    expect(r.os).toBe('Android')  // ANGLE blocks iOS from hardware; UA (Android) wins
    expect(r.osVersion).toBe('10') // osVersion also falls back to UA when hwOs is null
  })

  it('ctx: osVersion falls back to frozen UA value when platformVersion unavailable', () => {
    // When ANGLE confirms OS (MacOS) but getHighEntropyValues was not called / failed,
    // platformVersion is absent. osVersion stays at the UA-frozen '10.15.7'.
    // Tier 2 guarantees: if platformVersion IS available, chPlatform+platformVersion
    // would have produced hwOs != null before Tier 3 fires, so this is the correct fallback.
    const macUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    const ctx = {
      userAgent: macUA,
      platform: 'MacIntel',
      language: 'en-US',
      maxTouchPoints: 0,
      webglRenderer: 'ANGLE (Apple, ANGLE Metal Renderer: Apple M2, unspecified version)',
      // no highEntropyData → platformVersion unavailable
    }
    const r = parseUA(macUA, { ctx })
    expect(r.os).toBe('MacOS')
    expect(r.osVersion).toBe('10.15.7') // frozen UA value — platformVersion not available
  })

  it('ctx: osVersion from platformVersion — trailing zero stripped', () => {
    const macUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    const ctx = {
      ...macIntelCtx,
      userAgentData: { platform: 'macOS', getHighEntropyValues: async () => ({}) },
      highEntropyData: { platformVersion: '14.5.0', fullVersionList: [] },
    }
    const r = parseUA(macUA, { ctx })
    expect(r.os).toBe('MacOS')
    expect(r.osVersion).toBe('14.5')
  })

  it('ctx: osVersion from platformVersion — non-zero patch preserved', () => {
    const macUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    const ctx = {
      ...macIntelCtx,
      userAgentData: { platform: 'macOS', getHighEntropyValues: async () => ({}) },
      highEntropyData: { platformVersion: '14.5.1', fullVersionList: [] },
    }
    const r = parseUA(macUA, { ctx })
    expect(r.osVersion).toBe('14.5.1')
  })

  it('ctx: browser and version from fullVersionList, UA ignored for identity', () => {
    const ctx = {
      ...macIntelCtx,
      highEntropyData: {
        fullVersionList: [
          { brand: 'Google Chrome', version: '124.0.6367.201' },
          { brand: 'Chromium', version: '124.0.6367.201' },
        ],
      },
    }
    const r = parseUA(androidSpoofedUA, { ctx })
    expect(r.browser).toBe('Chrome')
    expect(r.version).toBe('124.0.6367.201')
  })

  it('ctx: Edge brand takes priority over Chromium in fullVersionList', () => {
    const ctx = {
      ...macIntelCtx,
      highEntropyData: {
        fullVersionList: [
          { brand: 'Chromium', version: '124.0.6367.201' },
          { brand: 'Microsoft Edge', version: '124.0.2478.80' },
        ],
      },
    }
    const r = parseUA(androidSpoofedUA, { ctx })
    expect(r.browser).toBe('Edge')
    expect(r.version).toBe('124.0.2478.80')
  })

  it('ctx: UA browser used when fullVersionList absent', () => {
    const r = parseUA(androidSpoofedUA, { ctx: macIntelCtx })
    expect(r.browser).toBe('Chrome')
  })

})

describe('parseUA — UA-only platform / language / arch inference', () => {
  it('macOS Safari → platform MacIntel, arch unknown (Apple Silicon also shows Intel in UA)', () => {
    const r = parseUA(UA.safari.desktop)
    expect(r.platform).toBe('MacIntel')
    expect(r.arch).toBe('unknown')
  })

  it('Windows Chrome x64 → platform Win64, arch x86_64', () => {
    const r = parseUA(UA.chrome.windows)
    expect(r.platform).toBe('Win64')
    expect(r.arch).toBe('x86_64')
  })

  it('iPhone Safari → platform iPhone, arch arm64', () => {
    const r = parseUA(UA.safari.ios)
    expect(r.platform).toBe('iPhone')
    expect(r.arch).toBe('arm64')
  })

  it('iPad Safari → platform iPad, arch arm64', () => {
    const r = parseUA(UA.safari.ipad)
    expect(r.platform).toBe('iPad')
    expect(r.arch).toBe('arm64')
  })

  it('Android Chrome (no aarch64 token) → platform Linux armv8l', () => {
    const androidUA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    const r = parseUA(androidUA)
    expect(r.platform).toBe('Linux armv8l')
  })

  it('Linux x86_64 Chrome → platform Linux x86_64', () => {
    const r = parseUA('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36')
    expect(r.platform).toBe('Linux x86_64')
  })

  it('Android OEM UA with zh-CN locale → language zh-CN', () => {
    const r = parseUA('Mozilla/5.0 (Linux; Android 10; zh-CN; M2007J17C Build/QKQ1.200629.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Mobile Safari/537.36')
    expect(r.language).toBe('zh-CN')
  })

  it('Android OEM UA with en-us locale → language en-US (normalized)', () => {
    const r = parseUA('Mozilla/5.0 (Linux; U; Android 4.0.4; en-us; Galaxy Nexus Build/IMM76B) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30')
    expect(r.language).toBe('en-US')
  })

  it('standard desktop UA → language unknown (no locale in UA)', () => {
    expect(parseUA(UA.chrome.windows).language).toBe('unknown')
    expect(parseUA(UA.safari.desktop).language).toBe('unknown')
  })

  it('WeChat UA with Language/zh_CN → language zh-CN', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.73(0x18004939) NetType/WIFI Language/zh_CN'
    expect(parseUA(ua).language).toBe('zh-CN')
  })

  it('WeChat UA with Language/en_US → language en-US', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.73 Language/en_US'
    expect(parseUA(ua).language).toBe('en-US')
  })

  it('Alipay UA with Language/zh-Hans-CN → language zh-Hans-CN', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AlipayClient/10.5.36 Language/zh-Hans-CN'
    expect(parseUA(ua).language).toBe('zh-Hans-CN')
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
    expect(r.versionMajor).toBe(0)
    expect(r.connectionType).toBe('unknown')
  })

  it('whitespace-only UA → all unknowns, no throw', () => {
    expect(() => parseUA('   ')).not.toThrow()
    expect(parseUA('   ').browser).toBe('unknown')
  })

  it('very long UA (10 000 chars) → no throw', () => {
    expect(() => parseUA('a'.repeat(10_000))).not.toThrow()
  })

  it('iPad UA with safari string → Tablet device', () => {
    const r = parseUA(UA.safari.ipad)
    expect(r.device).toBe('Tablet')
    expect(r.os).toBe('iOS')
  })
})

describe('parseUA — versionMajor', () => {
  it('Chrome 124 → versionMajor 124', () => {
    expect(parseUA(UA.chrome.windows).versionMajor).toBe(124)
  })

  it('unknown version → versionMajor 0', () => {
    expect(parseUA('').versionMajor).toBe(0)
  })
})

describe('parseUA — connectionType', () => {
  it('no nav → connectionType unknown', () => {
    expect(parseUA(UA.chrome.windows).connectionType).toBe('unknown')
  })

  it('nav with effectiveType 4g → connectionType 4g', () => {
    const r = parseUA(UA.chrome.android, {
      nav: { userAgent: UA.chrome.android, platform: '', language: '', maxTouchPoints: 5,
             connection: { effectiveType: '4g' } }
    })
    expect(r.connectionType).toBe('4g')
  })
})

describe('parseUA — Brave override via ctx', () => {
  it('Chrome UA + hasBrave → browser Brave', () => {
    const r = parseUA(UA.chrome.windows, { ctx: { userAgent: UA.chrome.windows, platform: '', language: '', maxTouchPoints: 0, hasBrave: true } as any })
    expect(r.browser).toBe('Brave')
  })

  it('Chrome UA without hasBrave → browser Chrome', () => {
    expect(parseUA(UA.chrome.windows).browser).toBe('Chrome')
  })
})

describe('parseUA — new enriched fields', () => {
  it('Chrome on Windows → browserType: browser', () => {
    expect(parseUA(UA.chrome.windows).browserType).toBe('browser')
  })

  it('WeChat mobile → browserType: app', () => {
    expect(parseUA(UA.wechat.mobile).browserType).toBe('app')
  })

  it('Chrome on Windows → engineVersion from AppleWebKit token', () => {
    expect(parseUA(UA.chrome.windows).engineVersion).toBe('537.36')
  })

  it('Safari desktop → engineVersion 605.1.15', () => {
    expect(parseUA(UA.safari.desktop).engineVersion).toBe('605.1.15')
  })

  it('Firefox desktop → engineVersion 20100101', () => {
    expect(parseUA(UA.firefox.desktop).engineVersion).toBe('20100101')
  })

  it('macOS Sonoma (14.x) → osVersionName: Sonoma', () => {
    const r = parseUA(UA.safari.desktop) // Mac OS X 14_3
    expect(r.osVersionName).toBe('Sonoma')
  })

  it('Windows 10 → osVersionName: Windows 10', () => {
    expect(parseUA(UA.chrome.windows).osVersionName).toBe('Windows 10')
  })

  it('Windows 11 via windowsVersion override → osVersionName: Windows 11', () => {
    const r = parseUA(UA.chrome.windows, { windowsVersion: '11' })
    expect(r.osVersionName).toBe('Windows 11')
  })

  it('iOS → osVersionName: unknown (no named iOS versions)', () => {
    expect(parseUA(UA.safari.ios).osVersionName).toBe('unknown')
  })

  it('Android Samsung SM-G991B → vendor: Samsung, model: SM-G991B', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; SM-G991B Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
    const r = parseUA(ua)
    expect(r.vendor).toBe('Samsung')
    expect(r.model).toBe('SM-G991B')
  })

  it('iPhone → vendor: Apple, model: iPhone', () => {
    const r = parseUA(UA.safari.ios)
    expect(r.vendor).toBe('Apple')
    expect(r.model).toBe('iPhone')
  })

  it('Pixel 7 → vendor: Google, model: Pixel 7', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    const r = parseUA(ua)
    expect(r.vendor).toBe('Google')
    expect(r.model).toBe('Pixel 7')
  })

  it('Windows Chrome → vendor: unknown, model: unknown (no device info in desktop UA)', () => {
    const r = parseUA(UA.chrome.windows)
    expect(r.vendor).toBe('unknown')
    expect(r.model).toBe('unknown')
  })

  it('Googlebot → botCategory: search-engine', () => {
    const r = parseUA('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
    expect(r.botCategory).toBe('search-engine')
  })

  it('GPTBot → botCategory: ai-llm', () => {
    const r = parseUA('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot')
    expect(r.botCategory).toBe('ai-llm')
  })

  it('regular Chrome → botCategory: unknown', () => {
    expect(parseUA(UA.chrome.windows).botCategory).toBe('unknown')
  })

  it('Brave → browserType: browser (not unknown)', () => {
    const r = parseUA(UA.chrome.windows, { ctx: { userAgent: UA.chrome.windows, platform: '', language: '', maxTouchPoints: 0, hasBrave: true } as any })
    expect(r.browserType).toBe('browser')
  })
})
