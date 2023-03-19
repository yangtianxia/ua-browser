export type HashOptions = Record<string, string>

export type OsVersionType =
  | 'Android'
  | 'iOS'
  | 'Debian'
  | 'Windows Phone'
  | 'MacOS'
  | 'WebOS'
  | 'HarmonyOS'
  | 'Windows'

export type EnvWebview = {
  isWebview: boolean
}

export type EnvPart = Record<'version' | 'osVersion' | 'platfrom' | 'languge', string>

export type EnvOption = EnvPart & EnvWebview & {
  engine:
    | 'Trident'
    | 'Presto'
    | 'WebKit'
    | 'Gecko'
    | 'KHTML'
    | 'Blink'
    | 'EdgeHTML'
    | 'unknown'
  browser:
    | 'Safari'
    | 'Chrome'
    | 'IE'
    | 'Edge'
    | 'Firefox'
    | 'Firefox Focus'
    | 'Chromium'
    | 'Opera'
    | 'Vivaldi'
    | 'Yandex'
    | 'Arora'
    | 'Lunascape'
    | 'QupZilla'
    | 'Coc Coc'
    | 'Kindle'
    | 'Iceweasel'
    | 'Konqueror'
    | 'Iceape'
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
		| 'OPPO'
    | 'XiaoMi'
    | 'Quark'
    | 'Qiyu'
    | 'Wechat'
    | 'WechatWork'
    | 'Taobao'
    | 'Alipay'
    | 'Weibo'
    | 'Douban'
    | 'Suning'
    | 'iQiYi'
    | 'DingTalk'
    | 'Huawei'
    | 'Vivo'
    | 'Firefox Nightly'
    | 'Wechat Miniapp'
		| 'Douyin'
    | 'unknown'
  os:
    | 'Windows'
    | 'Linux'
    | 'MacOS'
    | 'Android'
    | 'HarmonyOS'
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
    | 'unknown'
  device:
    | 'Mobile'
    | 'Tablet'
    | 'Pc'
}

declare function uaBrowser(ua?: string): EnvOption

declare namespace uaBrowser {
  /** 检查 `webview` 浏览环境，仅支持 `android` */
  function isWebview(ua: string): boolean
  /** 检查微信小程序 */
  function isWechatMiniapp(): boolean
  /** 浏览器语言 */
  function getLanguage(): string
  /** 当前版本 */
  const VERSION: string
}

export default uaBrowser

declare global {
  const __wxjs_environment: string

  const chrome: {
    adblock2345: any
    common2345: any
  }

  const showModalDialog: any

  const u2f: any

  // Navigator
  interface Navigator {
    browserLanguage: string
		userAgentData: Record<string, any>
    connection: Record<string, any>
  }
}

export {}
