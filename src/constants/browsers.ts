import type { BrowserName } from '../types.js'

export interface BrowserDef {
  name: BrowserName
  /** Detection regex — must match the UA for this browser to be a candidate. */
  detect: RegExp
  /**
   * Version extraction: capture-group regex (or array tried in order).
   * null = no direct version pattern (use chromeLookup only, or lookup table browsers).
   */
  versionPattern: RegExp | RegExp[] | null
  /** Chrome major-version → browser display version lookup (e.g. 360SE/EE, Liebao). */
  chromeLookup?: Record<string, string>
  /**
   * Detection priority. When multiple entries match the same UA, the one with
   * the highest priority wins. Explicit and verifiable — no reverse-iteration magic.
   */
  priority: number
}

export const BROWSER_DEFS: readonly BrowserDef[] = [
  // ── Generic / low-priority base browsers ──────────────────────────────────
  { name: 'Safari',        priority: 10,  detect: /Safari/,              versionPattern: /Version\/([\d.]+)/ },
  { name: 'Chrome',        priority: 20,  detect: /(Chrome|CriOS)/,      versionPattern: [/Chrome\/([\d.]+)/, /CriOS\/([\d.]+)/] },
  { name: 'IE',            priority: 30,  detect: /(MSIE|Trident)/,      versionPattern: [/MSIE ([\d.]+)/, /rv:([\d.]+)/] },
  { name: 'Edge',          priority: 40,  detect: /(Edge|Edg\/|EdgA|EdgiOS)/, versionPattern: [/Edge\/([\d.]+)/, /Edg\/([\d.]+)/, /EdgA\/([\d.]+)/, /EdgiOS\/([\d.]+)/] },
  { name: 'Firefox',       priority: 50,  detect: /(Firefox|FxiOS)/,    versionPattern: [/Firefox\/([\d.]+)/, /FxiOS\/([\d.]+)/] },
  { name: 'Firefox Focus', priority: 55,  detect: /Focus/,               versionPattern: /Focus\/([\d.]+)/ },
  { name: 'Chromium',      priority: 60,  detect: /Chromium/,            versionPattern: /Chromium\/([\d.]+)/ },
  { name: 'Opera',         priority: 70,  detect: /(Opera|OPR|OPT)/,     versionPattern: [/Opera\/([\d.]+)/, /OPR\/([\d.]+)/, /OPT\/([\d.]+)/] },
  { name: 'Vivaldi',       priority: 80,  detect: /Vivaldi/,             versionPattern: /Vivaldi\/([\d.]+)/ },
  { name: 'Yandex',           priority: 90,  detect: /YaBrowser/,           versionPattern: /YaBrowser\/([\d.]+)/ },
  { name: 'Samsung Internet', priority: 92,  detect: /SamsungBrowser/,      versionPattern: /SamsungBrowser\/([\d.]+)/ },
  { name: 'DuckDuckGo',       priority: 94,  detect: /DuckDuckGo\//,        versionPattern: /DuckDuckGo\/([\d.]+)/ },
  { name: 'Puffin',           priority: 96,  detect: /Puffin\//,            versionPattern: /Puffin\/([\d.]+)/ },
  { name: 'Coc Coc',       priority: 130, detect: /coc_coc_browser/,     versionPattern: /coc_coc_browser\/([\d.]+)/ },
  { name: 'Kindle',        priority: 140, detect: /(Kindle|Silk\/)/,     versionPattern: /Version\/([\d.]+)/ },
  { name: 'Konqueror',     priority: 160, detect: /Konqueror/,           versionPattern: /Konqueror\/([\d.]+)/ },
  { name: 'SeaMonkey',     priority: 180, detect: /SeaMonkey/,           versionPattern: /SeaMonkey\/([\d.]+)/ },
  { name: 'Epiphany',      priority: 190, detect: /Epiphany/,            versionPattern: /Epiphany\/([\d.]+)/ },
  { name: 'Maxthon',       priority: 200, detect: /Maxthon/,             versionPattern: /Maxthon\/([\d.]+)/ },

  // ── Chinese / Asian browsers — higher priority than generic Chrome ─────────
  { name: '360',           priority: 300, detect: /(QihooBrowser|QHBrowser)/, versionPattern: /QihooBrowser\/([\d.]+)/ },
  { name: '360SE',         priority: 310, detect: /360SE/,               versionPattern: null,
    chromeLookup: { '108': '14.0', '86': '13.0', '78': '12.0', '69': '11.0',
                    '63': '10.0', '55': '9.1', '45': '8.1', '42': '8.0', '31': '7.0', '21': '6.3' } },
  { name: '360EE',         priority: 320, detect: /360EE/,               versionPattern: null,
    chromeLookup: { '86': '13.0', '78': '12.0', '69': '11.0', '63': '9.5',
                    '55': '9.0', '50': '8.7', '30': '7.5' } },
  { name: 'UC',            priority: 330, detect: /(UCBrowser|UBrowser|UCWEB)/, versionPattern: /UC?Browser\/([\d.]+)/ },
  { name: 'QQBrowser',     priority: 340, detect: /QQBrowser/,           versionPattern: /QQBrowser\/([\d.]+)/ },
  { name: 'QQ',            priority: 345, detect: /QQ\//,                versionPattern: /QQ\/([\d.]+)/ },
  { name: 'Baidu',         priority: 350, detect: /(Baidu|BIDUBrowser|baidubrowser|baiduboxapp|BaiduHD)/, versionPattern: [/BIDUBrowser[\s/]([\d.]+)/, /baiduboxapp\/([\d.]+)/] },
  { name: 'Sogou',         priority: 360, detect: /(MetaSr|Sogou)/,      versionPattern: [/SE ([\d.X]+)/, /SogouMobileBrowser\/([\d.]+)/] },
  { name: 'Liebao',        priority: 370, detect: /(LBBROWSER|LieBaoFast)/, versionPattern: /LieBaoFast\/([\d.]+)/,
    chromeLookup: { '57': '6.5', '49': '6.0', '46': '5.9', '42': '5.3',
                    '39': '5.2', '34': '5.0', '29': '4.5', '21': '4.0' } },
  { name: '2345Explorer',  priority: 380, detect: /2345Explorer/,        versionPattern: [/2345Explorer\/([\d.]+)/, /Mb2345Browser\/([\d.]+)/],
    chromeLookup: { '69': '10.0', '55': '9.9' } },
  { name: '115Browser',    priority: 390, detect: /115Browser/,          versionPattern: /115Browser\/([\d.]+)/ },
  { name: 'TheWorld',      priority: 400, detect: /TheWorld/,            versionPattern: /TheWorld ([\d.]+)/ },
  { name: 'XiaoMi',        priority: 410, detect: /MiuiBrowser/,         versionPattern: /MiuiBrowser\/([\d.]+)/ },
  { name: 'Vivo',          priority: 420, detect: /VivoBrowser/,         versionPattern: /VivoBrowser\/([\d.]+)/ },
  { name: 'Huawei',        priority: 430, detect: /HuaweiBrowser/,       versionPattern: [/HuaweiBrowser\/([\d.]+)/, /Version\/([\d.]+)/] },
  { name: 'OPPO',          priority: 440, detect: /HeyTapBrowser/,       versionPattern: /HeyTapBrowser\/([\d.]+)/ },
  { name: 'Quark',         priority: 450, detect: /Quark/,               versionPattern: /Quark\/([\d.]+)/ },
  { name: 'Qiyu',          priority: 460, detect: /Qiyu/,                versionPattern: /Qiyu\/([\d.]+)/ },

  // ── App webviews — highest priority ───────────────────────────────────────
  { name: 'WechatWork',    priority: 500, detect: /wxwork\//,            versionPattern: /wxwork\/([\d.]+)/ },
  { name: 'Wechat',        priority: 510, detect: /MicroMessenger/,      versionPattern: /MicroMessenger\/([\d.]+)/ },
  { name: 'Taobao',        priority: 520, detect: /AliApp\(TB/,          versionPattern: /AliApp\(TB\/([\d.]+)/ },
  { name: 'Alipay',        priority: 530, detect: /AliApp\(AP/,          versionPattern: /AliApp\(AP\/([\d.]+)/ },
  { name: 'Weibo',         priority: 540, detect: /Weibo/,               versionPattern: /weibo__([\d.]+)/ },
  { name: 'Douban',        priority: 550, detect: /com\.douban\.frodo/,  versionPattern: /com\.douban\.frodo\/([\d.]+)/ },
  { name: 'Suning',        priority: 560, detect: /SNEBUY-APP/,          versionPattern: /SNEBUY-APP([\d.]+)/ },
  { name: 'iQiYi',         priority: 570, detect: /IqiyiApp/,            versionPattern: /IqiyiVersion\/([\d.]+)/ },
  { name: 'DingTalk',      priority: 580, detect: /DingTalk/,            versionPattern: /DingTalk\/([\d.]+)/ },
  { name: 'Douyin',        priority: 590, detect: /aweme/,               versionPattern: /app_version\/([\d.]+)/ },
  { name: 'Bilibili',      priority: 592, detect: /BiliBili\//,           versionPattern: /BiliBili\/([\d.]+)/ },
  { name: 'Kuaishou',      priority: 594, detect: /Kwai\//,               versionPattern: /Kwai\/([\d.]+)/ },
  { name: 'Xiaohongshu',   priority: 596, detect: /Xiaohongshu\//,        versionPattern: /Xiaohongshu\/([\d.]+)/ },
  { name: 'Feishu',        priority: 597, detect: /(Lark|Feishu)\//,      versionPattern: [/Lark\/([\d.]+)/, /Feishu\/([\d.]+)/] },
  { name: 'Toutiao',       priority: 598, detect: /NewsArticle\//,        versionPattern: /NewsArticle\/([\d.]+)/ },
  { name: 'JD',            priority: 599, detect: /jdpingou\//,           versionPattern: /jdpingou\/([\d.]+)/ },
  { name: 'Meituan',       priority: 600, detect: /MeituanHybrid\//,      versionPattern: /MeituanHybrid\/([\d.]+)/ }
] as const
