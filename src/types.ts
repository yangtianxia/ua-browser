export type EngineName =
  | 'Trident'
  | 'Presto'
  | 'WebKit'
  | 'Gecko'
  | 'KHTML'
  | 'Blink'
  | 'EdgeHTML'
  | 'ArkWeb'
  | 'unknown'

export type BrowserName =
  | 'Safari'
  | 'Chrome'
  | 'IE'
  | 'Edge'
  | 'Firefox'
  | 'Firefox Focus'
  | 'Firefox Nightly'
  | 'Chromium'
  | 'Opera'
  | 'Vivaldi'
  | 'Yandex'
  | 'Samsung Internet'
  | 'DuckDuckGo'
  | 'Puffin'
  | 'Coc Coc'
  | 'Kindle'
  | 'Konqueror'
  | 'SeaMonkey'
  | 'Epiphany'
  | '360'
  | '360EE'
  | '360SE'
  | 'UC'
  | 'QQBrowser'
  | 'QQ'
  | 'Baidu'
  | 'Maxthon'
  | 'Sogou'
  | 'Liebao'
  | '2345Explorer'
  | '115Browser'
  | 'TheWorld'
  | 'XiaoMi'
  | 'Vivo'
  | 'Huawei'
  | 'OPPO'
  | 'Quark'
  | 'Qiyu'
  | 'Wechat'
  | 'Wechat Miniapp'
  | 'WechatWork'
  | 'Taobao'
  | 'Alipay'
  | 'Weibo'
  | 'Douban'
  | 'Suning'
  | 'iQiYi'
  | 'DingTalk'
  | 'Douyin'
  | 'Bilibili'
  | 'Kuaishou'
  | 'Xiaohongshu'
  | 'Feishu'
  | 'Toutiao'
  | 'JD'
  | 'Meituan'
  | 'Alipay Miniapp'
  | 'Baidu Miniapp'
  | 'Douyin Miniapp'
  | 'QQ Miniapp'
  | 'Kuaishou Miniapp'
  | 'unknown'

export type OsName =
  | 'Windows'
  | 'Linux'
  | 'MacOS'
  | 'Android'
  | 'HarmonyOS'
  | 'OpenHarmony'
  | 'Ubuntu'
  | 'FreeBSD'
  | 'Debian'
  | 'Windows Phone'
  | 'BlackBerry'
  | 'MeeGo'
  | 'Symbian'
  | 'iOS'
  | 'Chrome OS'
  | 'WebOS'
  | 'Tizen'
  | 'KaiOS'
  | 'unknown'

export type DeviceName = 'Mobile' | 'Tablet' | 'PC' | 'TV'

export type ArchName = 'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'

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

export interface EnvOption {
  browser: BrowserName
  version: string
  engine: EngineName
  os: OsName
  osVersion: string
  device: DeviceName
  arch: ArchName
  isWebview: boolean
  isHeadless: boolean
  isBot: boolean
  botName: BotName
  language: string
  platform: string
}

// ---------------------------------------------------------------------------
// Global type augmentations for browser-specific APIs used during detection
// ---------------------------------------------------------------------------

declare global {
  const __wxjs_environment: string

  // eslint-disable-next-line no-var
  var swan: { getSystemInfo?: unknown } | undefined
  // eslint-disable-next-line no-var
  var tt: { getSystemInfo?: unknown } | undefined
  // eslint-disable-next-line no-var
  var qq: { getSystemInfo?: unknown } | undefined
  // eslint-disable-next-line no-var
  var ks: { getSystemInfo?: unknown } | undefined

  // eslint-disable-next-line no-var
  var chrome: {
    adblock2345?: unknown
    common2345?: unknown
  } | undefined

  // eslint-disable-next-line no-var
  var showModalDialog: unknown

  // eslint-disable-next-line no-var
  var u2f: unknown

  interface Window {
    my?: { getSystemInfo?: unknown }
  }

  interface Navigator {
    browserLanguage?: string
    deviceMemory?: number
    userAgentData?: {
      platform: string
      getHighEntropyValues(hints: string[]): Promise<Record<string, string>>
    }
    connection?: { saveData?: boolean }
  }
}

export {}
