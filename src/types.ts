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
  | 'Arc'
  | 'Brave'
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
  | 'visionOS'
  | 'tvOS'
  | 'Chrome OS'
  | 'WebOS'
  | 'Tizen'
  | 'KaiOS'
  | 'unknown'

export type DeviceName = 'Mobile' | 'Tablet' | 'PC' | 'TV' | 'Console' | 'XR' | 'unknown'

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

export interface EnvOption {
  browser:        BrowserName
  version:        string
  versionMajor:   number
  engine:         EngineName
  os:             OsName
  osVersion:      string
  device:         DeviceName
  arch:           ArchName
  isWebview:      boolean
  isHeadless:     boolean
  isBot:          boolean
  botName:        BotName
  language:       string
  platform:       string
  connectionType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'
}

// ---------------------------------------------------------------------------
// Global type augmentations for browser-specific APIs used during detection
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var chrome: {
    adblock2345?: unknown
    common2345?: unknown
  } | undefined

  // eslint-disable-next-line no-var
  var showModalDialog: unknown

  // eslint-disable-next-line no-var
  var u2f: unknown

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
