import type { OsVersionType, HashOptions } from './types'

let NAVIGATOR = {} as Navigator

if (typeof navigator !== 'undefined') {
  NAVIGATOR = navigator
}

const UA = NAVIGATOR.userAgent
const mimeTypes = NAVIGATOR.mimeTypes
const platfrom = NAVIGATOR.platform

/** 内核 */
const engineRegExp = {
  Trident: /(Trident|NET CLR)/,
  Presto: /Presto/,
  WebKit: /AppleWebKit/,
  Gecko: /Gecko\//,
  KHTML: /KHTML\//
}

/** 浏览器 */
const browserRegExp = {
  Safari: /Safari/,
  Chrome: /(Chrome|CriOS)/,
  IE: /(MSIE|Trident)/,
  Edge: /(Edge|Edg\/|EdgA|EdgiOS)/,
  Firefox: /(Firefox|FxiOS)/,
  'Firefox Focus': /Focus/,
  Chromium: /Chromium/,
  Opera: /(Opera|OPR|OPT)/,
  Vivaldi: /Vivaldi/,
  Yandex: /YaBrowser/,
  Arora: /Arora/,
  Lunascape: /Lunascape/,
  QupZilla: /QupZilla/,
  'Coc Coc': /coc_coc_browser/,
  Kindle: /(Kindle|Silk\/)/,
  Iceweasel: /Iceweasel/,
  Konqueror: /Konqueror/,
  Iceape: /Iceape/,
  SeaMonkey: /SeaMonkey/,
  Epiphany: /Epiphany/,
  '360': /(QihooBrowser|QHBrowser)/,
  '360EE': /360EE/,
  '360SE': /360SE/,
  UC: /(UCBrowser|UBrowser|UCWEB)/,
  QQBrowser: /QQBrowser/,
  QQ: /QQ\//,
  Baidu: /(Baidu|BIDUBrowser|baidubrowser|baiduboxapp|BaiduHD)/,
  Maxthon: /Maxthon/,
  Sogou: /(MetaSr|Sogou)/,
  Liebao: /(LBBROWSER|LieBaoFast)/,
  '2345Explorer': /2345Explorer/,
  '115Browser': /115Browser/,
  TheWorld: /TheWorld/,
  XiaoMi: /MiuiBrowser/,
  Quark: /Quark/,
  Qiyu: /Qiyu/,
  Wechat: /MicroMessenger/,
  WechatWork: /wxwork\//,
  Taobao: /AliApp\(TB/,
  Alipay: /AliApp\(AP/,
  Weibo: /Weibo/,
  Douban: /com\.douban\.frodo/,
  Suning: /SNEBUY-APP/,
  iQiYi: /IqiyiAp/,
  DingTalk: /DingTalk/,
  Huawei: /(HuaweiBrowser|HUAWEI\/|HONOR)/,
  Vivo: /VivoBrowser/
}

/** 系统或平台 */
const osRegExp = {
  Windows: /Windows/,
  Linux: /(Linux|X11)/,
  MacOS: /Macintosh/,
  Android: /(Android|Adr)/,
  HarmonyOS: /HarmonyOS/,
  Ubuntu: /Ubuntu/,
  FreeBSD: /FreeBSD/,
  Debian: /Debian/,
  'Windows Phone': /(IEMobile|Windows Phone)/,
  BlackBerry: /(BlackBerry|RIM)/,
  MeeGo: /MeeGo/,
  Symbian: /Symbian/,
  iOS: /like Mac OS X/,
  'Chrome OS': /CrOS/,
  WebOS: /hpwOS/
}

/** 设备 */
const deviceRegExp = {
  Mobile: /(Mobi|iPh|480)/,
  Tablet: /(Tablet|Pad|Nexus 7)/
}

/** 环境 */
const envRegExp = {
  isWebview: /; wv/
}

const hash = {
  device: ['Mobile', 'Tablet'],
  os: ['Windows', 'Linux', 'MacOS', 'Android', 'HarmonyOS', 'Ubuntu', 'FreeBSD', 'Debian', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'iOS', 'Chrome OS', 'WebOS'],
  engine: ['Trident', 'Presto', 'WebKit', 'Gecko', 'KHTML'],
  browser: ['Safari', 'Chrome', 'IE', 'Edge', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Arora', 'Lunascape', 'QupZilla', 'Coc Coc', 'Kindle', 'Iceweasel', 'Konqueror', 'Iceape', 'SeaMonkey', 'Epiphany', '360', '360EE', '360SE', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'Liebao', '2345Explorer', '115Browser', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'WechatWork', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi', 'DingTalk', 'Huawei', 'Vivo']
}

const getMimeType = (value: string) => {
  try {
    return !!mimeTypes.namedItem(value)
  } catch (e) {
    return false
  }
}

const getValueOf = (
  values: string[],
  reg: Record<string, RegExp>,
  ua = UA
) => {
  let i = values.length
  while (i--) {
    const value = values[i]
    if (reg[value].test(ua)) return value
  }
  return 'unknown'
}

export const getLanguage = () => (NAVIGATOR.browserLanguage || NAVIGATOR.language)?.replace(/-\w+/g, (word) => word.toUpperCase())

export const isWechatMiniapp = () => typeof __wxjs_environment !== 'undefined' && __wxjs_environment === 'miniprogram'

export const isWebview = (ua: string) => envRegExp.isWebview.test(ua)

export default class UaBrowser {
  private ua = UA

  private version = {
    Safari: () => this.ua.replace(/^.*Version\/([\d.]+).*$/, '$1'),
    Chrome: () => this.ua.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1'),
    IE: () => this.ua.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1'),
    Edge: () => this.ua.replace(/^.*Edge\/([\d.]+).*$/, '$1').replace(/^.*Edg\/([\d.]+).*$/, '$1').replace(/^.*EdgA\/([\d.]+).*$/, '$1').replace(/^.*EdgiOS\/([\d.]+).*$/, '$1'),
    Firefox: () => this.ua.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1'),
    'Firefox Focus': () => this.ua.replace(/^.*Focus\/([\d.]+).*$/, '$1'),
    Chromium: () => this.ua.replace(/^.*Chromium\/([\d.]+).*$/, '$1'),
    Opera: () => this.ua.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1').replace(/^.*OPT\/([\d.]+).*$/, '$1'),
    Vivaldi: () => this.ua.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1'),
    Yandex: () => this.ua.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1'),
    Arora: () => this.ua.replace(/^.*Arora\/([\d.]+).*$/, '$1'),
    Lunascape: () => this.ua.replace(/^.*Lunascape[\s]([\d.]+).*$/, '$1'),
    QupZilla: () => this.ua.replace(/^.*QupZilla[\s]([\d.]+).*$/, '$1'),
    'Coc Coc': () => this.ua.replace(/^.*coc_coc_browser\/([\d.]+).*$/, '$1'),
    Kindle: () => this.ua.replace(/^.*Version\/([\d.]+).*$/, '$1'),
    Iceweasel: () => this.ua.replace(/^.*Iceweasel\/([\d.]+).*$/, '$1'),
    Konqueror: () => this.ua.replace(/^.*Konqueror\/([\d.]+).*$/, '$1'),
    Iceape: () => this.ua.replace(/^.*Iceape\/([\d.]+).*$/, '$1'),
    SeaMonkey: () => this.ua.replace(/^.*SeaMonkey\/([\d.]+).*$/, '$1'),
    Epiphany: () => this.ua.replace(/^.*Epiphany\/([\d.]+).*$/, '$1'),
    Maxthon: () => this.ua.replace(/^.*Maxthon\/([\d.]+).*$/, '$1'),
    QQBrowser: () => this.ua.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1'),
    QQ: () => this.ua.replace(/^.*QQ\/([\d.]+).*$/, '$1'),
    Baidu: () => this.ua.replace(/^.*BIDUBrowser[\s/]([\d.]+).*$/, '$1').replace(/^.*baiduboxapp\/([\d.]+).*$/, '$1'),
    UC: () => this.ua.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1'),
    Sogou: () => this.ua.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1'),
    TheWorld: () => this.ua.replace(/^.*TheWorld ([\d.]+).*$/, '$1'),
    XiaoMi: () => this.ua.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1'),
    Vivo: () => this.ua.replace(/^.*VivoBrowser\/([\d.]+).*$/, '$1'),
    Quark: () => this.ua.replace(/^.*Quark\/([\d.]+).*$/, '$1'),
    Qiyu: () => this.ua.replace(/^.*Qiyu\/([\d.]+).*$/, '$1'),
    Wechat: () => this.ua.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1'),
    WechatWork: () => this.ua.replace(/^.*wxwork\/([\d.]+).*$/, '$1'),
    Taobao: () => this.ua.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1'),
    Alipay: () => this.ua.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1'),
    Weibo: () => this.ua.replace(/^.*weibo__([\d.]+).*$/, '$1'),
    Douban: () => this.ua.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1'),
    Suning: () => this.ua.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1'),
    iQiYi: () => this.ua.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1'),
    DingTalk: () => this.ua.replace(/^.*DingTalk\/([\d.]+).*$/, '$1'),
    Huawei: () => this.ua.replace(/^.*Version\/([\d.]+).*$/, '$1').replace(/^.*HuaweiBrowser\/([\d.]+).*$/, '$1'),
    '115Browser': () => this.ua.replace(/^.*115Browser\/([\d.]+).*$/, '$1'),
    '360': () => this.ua.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1'),
    '360SE': () => {
      const vers = this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1')
      const hash: HashOptions = {
        '86': '13.0',
        '78': '12.0',
        '69': '11.0',
        '63': '10.0',
        '55': '9.1',
        '45': '8.1',
        '42': '8.0',
        '31': '7.0',
        '21': '6.3'
      }
      return hash[vers] || ''
    },
    '360EE': () => {
      const vers = this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1')
      const hash: HashOptions = {
        '86': '13.0',
        '78': '12.0',
        '69': '11.0',
        '63': '9.5',
        '55': '9.0',
        '50': '8.7',
        '30': '7.5'
      }
      return hash[vers] || ''
    },
    '2345Explorer': () => {
      const vers = this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1')
      const hash: HashOptions = {
        '69': '10.0',
        '55': '9.9'
      }
      return hash[vers] || this.ua.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1').replace(/^.*Mb2345Browser\/([\d.]+).*$/, '$1')
    },
    Liebao: () => {
      let _version = ''
      if (/LieBaoFast/.test(this.ua)) {
        _version = this.ua.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1')
      }
      const vers = this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1')
      const hash: HashOptions = {
        '57': '6.5',
        '49': '6.0',
        '46': '5.9',
        '42': '5.3',
        '39': '5.2',
        '34': '5.0',
        '29': '4.5',
        '21': '4.0'
      }
      return _version || hash[vers] || ''
    }
  }

  private osVersion = {
    Android: () => this.ua.replace(/^.*Android ([\d.]+);.*$/, '$1'),
    iOS: () => this.ua.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.'),
    Debian: () => this.ua.replace(/^.*Debian\/([\d.]+).*$/, '$1'),
    'Windows Phone': () => this.ua.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2'),
    MacOS: () => this.ua.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.'),
    WebOS: () => this.ua.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1'),
    HarmonyOS: () => {
      const vers = this.ua.replace(/^Mozilla.*Android ([\d.]+)[;)].*$/, '$1')
      const hash: HashOptions = {
        '10': '2'
      }
      return hash[vers] || ''
    },
    Windows: () => {
      const vers = this.ua.replace(/^Mozilla\/\d.0 \(Windows NT ([\d.]+);.*$/, '$1')
      const hash: HashOptions = {
        '10': '10',
        '6.4': '10',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.2': 'XP',
        '5.1': 'XP',
        '5.0': '2000'
      }
      return hash[vers] || vers
    }
  }

  private getOs () {
    return getValueOf(hash.os, osRegExp, this.ua)
  }

  private getEngine () {
    return getValueOf(hash.engine, engineRegExp, this.ua)
  }

  private getBrowser () {
    return getValueOf(hash.browser, browserRegExp, this.ua)
  }

  private getDevice () {
    if (platfrom === 'MacIntel' && NAVIGATOR.maxTouchPoints > 1) {
      return 'Tablet'
    }
    const device = getValueOf(hash.device, deviceRegExp, this.ua)
    return device === 'unknown' ? 'PC' : device
  }

  constructor (ua?: string) {
    if (ua) {
      this.ua = ua
    }
  }

  getEnv (ua?: string) {
    if (ua) {
      this.ua = ua
    } else {
      this.ua = UA
    }

    const env = {
      version: 'unknown',
      osVersion: 'unknown',
      engine: this.getEngine(),
      browser: this.getBrowser(),
      os: this.getOs(),
      device: this.getDevice(),
      isWebview: isWebview(this.ua),
      language: getLanguage() ?? 'unknown',
      platfrom: platfrom ?? 'unknown'
    }

    let browser = env.browser
    let is360 = false

    if (typeof chrome !== 'undefined') {
      const vers = this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1')

      if (chrome.adblock2345 || chrome.common2345) {
        env.browser = '2345Explorer'
      } else if (getMimeType('application/360softmgrplugin') || getMimeType('application/mozilla-npqihooquicklogin') || (vers > '36' && typeof showModalDialog !== 'undefined')) {
        is360 = true
      } else if (vers > '45') {
        is360 = getMimeType('application/vnd.chromium.remoting-viewer')
  
        if (!is360 && vers >= '69') {
          is360 = getMimeType('application/hwepass2001.installepass2001') || getMimeType('application/asx')
        }
      }
    }

    if (env.device === 'Mobile' && /iPad/.test(this.ua)) {
      env.device = 'Tablet'
    } else if (is360) {
      if (getMimeType('application/gameplugin') || !NAVIGATOR?.connection?.saveData) {
        browser = '360SE'
      } else {
        browser = '360EE'
      }
    }

    if (hash.browser.indexOf(browser) >= hash.browser.indexOf(env.browser)) {
      env.browser = browser
    }

    if (env.browser === 'Baidu' && browserRegExp.Opera.test(this.ua)) {
      env.browser = 'Opera'
    }

    if (env.os in this.osVersion) {
      env.osVersion = this.osVersion[env.os as OsVersionType]()
  
      if (env.osVersion === this.ua) {
        env.osVersion = 'unknown'
      }
    }

    if (env.browser in this.version) {
      env.version = this.version[env.browser as keyof typeof browserRegExp]()
  
      if (env.version === this.ua) {
        env.version = 'unknown'
      }
    }

    if (env.browser === 'Chrome' && this.ua.match(/\S+Browser/)) {
      env.browser = this.ua.match(/\S+Browser/)![0] as any
      env.version = this.ua.replace(/^.*Browser\/([\d.]+).*$/, '$1')
    } else if (env.browser === 'Firefox' && (typeof clientInformation !== 'undefined' || !(typeof u2f !== 'undefined'))) {
      env.browser = `${env.browser} Nightly`
    } else if (env.browser === 'Wechat' && isWechatMiniapp()) {
      env.browser = 'Wechat Miniapp'
    }
  
    if (env.browser === 'Edge') {
      env.engine = parseInt(env.version) > 75 ? 'Blink' : 'EdgeHTML'
    } else if (
      (browserRegExp.Chrome.test(this.ua) && env.engine === 'WebKit' && parseInt(this.version.Chrome()) > 27) ||
      (env.browser === 'Opera' && parseInt(env.version) > 12) ||
      (env.browser === 'Yandex')
    ) {
      env.engine = 'Blink'
    }
  
    return env
  }
}