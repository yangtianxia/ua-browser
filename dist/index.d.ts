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

export function uaBrowser(ua?: string): EnvOption

export namespace uaBrowser {
  /** 检查 `webview` 浏览环境，仅支持 `android` */
  function isWebview(ua: string): boolean
  /** 检查微信小程序 */
  function isWechatMiniapp(): boolean
  /** 浏览器语言 */
  function getLanguage(): string
  /** 当前版本 */
  const VERSION: string
}

declare global {
  // Window
  interface Window {
    __wxjs_environment: string
    showModalDialog: any
    chrome: {
      adblock2345: any
      common2345: any
    }
  }

  // Navigator
  interface Navigator {
    browserLanguage: string
    connection: {
      saveData: any
    }
  }
}

export {}