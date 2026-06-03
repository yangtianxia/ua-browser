/** Curated UA strings used across all test files. */
export const UA = {
  chrome: {
    windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    crios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.88 Mobile/15E148 Safari/604.1',
    crios26: 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/147.0.7727.99 Mobile/15E148 Safari/604.1',
    old26: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31'
  },
  arc: {
    mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.60 Safari/537.36 Arc/1.34.0',
    windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.60 Safari/537.36 Arc/1.34.0'
  },
  edge: {
    chromium: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    legacy: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586',
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/124.0.0.0 Mobile/15E148 Safari/604.1',
    android: 'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 EdgA/124.0.0.0'
  },
  firefox: {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/125.0 Mobile/15E148 Safari/604.1',
    focus: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/121.0 Focus/121.0 Mobile/15E148'
  },
  safari: {
    desktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    ipad: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    // iOS 26+: Apple freezes CPU iPhone OS at 18_7; Version/ carries the real version
    ios26: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1',
    // macOS 26+: UA still freezes "Mac OS X 10_15_7"; Version/ aligns with macOS major version
    mac26: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Safari/605.1.15'
  },
  ie: {
    ie11: 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
    ie9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)'
  },
  opera: {
    modern: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 OPR/110.0.0.0',
    legacy: 'Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.17'
  },
  // Chinese browsers
  wechat: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.37.2380 NetType/WIFI Language/zh_CN'
  },
  wechatWork: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 wxwork/4.1.2'
  },
  qq: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.0.0 Mobile Safari/537.36 QQBrowser/13.4.5.5055',
    qq: 'Mozilla/5.0 (Linux; Android 12; SM-G991B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36 QQ/8.9.28.635',
    // iOS uses MQQBrowser/ token instead of QQBrowser/
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 MQQBrowser/16.3.2 Mobile/15E148 Safari/604.1'
  },
  uc: {
    mobile: 'Mozilla/5.0 (Linux; U; Android 9; zh-CN; POCOPHONE F1) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 UCBrowser/13.4.2.1306 Mobile Safari/537.36'
  },
  baidu: {
    mobile: 'Mozilla/5.0 (Linux; Android 9; SM-G965F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36 baiduboxapp/12.19.0.10'
  },
  dingtalk: {
    mobile: 'Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.210 Mobile Safari/537.36 DingTalk/6.0.30'
  },
  '360se': {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36 360SE'
  },
  '360ee': {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36 360EE'
  },
  taobao: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 AliApp(TB/10.10.0) WindVane/8.6.0'
  },
  alipay: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 AliApp(AP/10.3.20)'
  },
  douyin: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 aweme/20.6.0 app_version/20.6.0'
  },
  // Desktop domestic browsers
  '360': {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 QihooBrowser/12.0'
  },
  sogou: {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 SE 2.X MetaSr 1.0',
    mobile:  'Mozilla/5.0 (Linux; Android 9; SM-G965F) AppleWebKit/537.36 (KHTML, like Gecko) SogouMobileBrowser/6.14.3 Chrome/87.0.4280.141 Mobile Safari/537.36'
  },
  maxthon: {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Maxthon/6.1.3.1000'
  },
  liebao: {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36 LBBROWSER'
  },
  '2345explorer': {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 2345Explorer/10.0.0.16835'
  },
  '115browser': {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 115Browser/23.9.3.1'
  },
  theWorld: {
    desktop: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 TheWorld 7.0.0.1'
  },
  // Mobile brand browsers
  xiaomi: {
    mobile: 'Mozilla/5.0 (Linux; Android 13; M2012K11AC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36 XiaoMi/MiuiBrowser/14.0.9'
  },
  vivo: {
    mobile: 'Mozilla/5.0 (Linux; Android 13; V2209A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36 VivoBrowser/17.0.0.0'
  },
  huawei: {
    mobile: 'Mozilla/5.0 (Linux; Android 11; ELS-AN00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.127 HuaweiBrowser/12.0.0.303 Mobile Safari/537.36',
    // Old format: HuaweiBrowser token without /version — falls back to Version/ pattern
    old:    'Mozilla/5.0 (Linux; Android 6.0; PLK-AL10 Build/HuaweiPLK-AL10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 HuaweiBrowser Mobile Safari/537.36'
  },
  oppo: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; CPH2399) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36 HeyTapBrowser/40.8.32.1'
  },
  quark: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.101 Mobile Safari/537.36 Quark/6.8.0.560'
  },
  qiyu: {
    mobile: 'Mozilla/5.0 (Linux; Android 9; vivo X23) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36 Qiyu/3.9.1'
  },
  // App WebViews (previously missing)
  weibo: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 Weibo weibo__13.4.0'
  },
  douban: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 com.douban.frodo/7.54.0'
  },
  suning: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 SNEBUY-APP9.3.0'
  },
  iqiyi: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 IqiyiApp IqiyiVersion/13.4.0'
  },
  // International browsers
  samsungInternet: {
    mobile: 'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Mobile Safari/537.36'
  },
  duckduckgo: {
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 DuckDuckGo/7 Safari/604.1',
    // v26+: token changed from DuckDuckGo/ to Ddg/
    iosDdg: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1 Ddg/26.4',
    android: 'Mozilla/5.0 (Linux; Android 12; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36 DuckDuckGo/5'
  },
  puffin: {
    android: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 Puffin/9.7.2.51166AP'
  },
  // OS-specific
  webview: {
    android: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36; wv)',
    iosWKWebView: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  },
  // HarmonyOS / OpenHarmony
  harmonyOs: {
    legacy: 'Mozilla/5.0 (Linux; Android 10; HarmonyOS; ANA-AN00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 HuaweiBrowser/11.0.8.301 Mobile Safari/537.36',
    android11: 'Mozilla/5.0 (Linux; Android 11; NOH-AN00; HarmonyOS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.48 Mobile Safari/537.36',
    android13: 'Mozilla/5.0 (Linux; Android 13; HarmonyOS; HUAWEI Mate60Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
    next: 'Mozilla/5.0 (Linux; HarmonyOS 5.0.0; HUAWEI GT5 Pro Build/HUAWEIAGT5Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    arkWeb: 'Mozilla/5.0 (Linux; HarmonyOS 5.0; Huawei ArkWeb/4.1.6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  },
  openHarmony: {
    standard: 'Mozilla/5.0 (Linux; OpenHarmony 4.1; HONOR X8b Build/HONORX8b) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  },
  // New App WebViews
  bilibili: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 BiliBili/6.24.0 os/android model/SM-G991B mobi_app/android'
  },
  kuaishou: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 Kwai/10.2.40.5370'
  },
  xiaohongshu: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 Xiaohongshu/7.51.1'
  },
  feishu: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 Lark/6.8.9 RangersAppID/1305903'
  },
  toutiao: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 NewsArticle/8.7.5'
  },
  jd: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 jdpingou/3.5.0'
  },
  meituan: {
    mobile: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 MeituanHybrid/1.0'
  },
  // Apple platform variants
  visionOS: {
    v1: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1 visionOS/1.0'
  },
  tvOS: {
    v17: 'Mozilla/5.0 (Apple TV; U; CPU OS 17_4 like Mac OS X) AppleWebKit/606.1 (KHTML, like Gecko) Version/17.0 Safari/606.1'
  },
  // Gaming consoles
  ps5: {
    browser: 'Mozilla/5.0 (PlayStation 5 3.20) AppleWebKit/605.1.15 (KHTML, like Gecko)'
  },
  xbox: {
    edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586'
  },
  // XR headsets
  quest: {
    browser: 'Mozilla/5.0 (Linux; Android 10; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/32.0.0.0 SamsungBrowser/4.3 Chrome/130.0.0.0 Mobile Safari/537.36'
  },
  // Empty / edge cases
  empty: '',
  node: 'node-fetch/1.0 (+https://github.com/node-fetch/node-fetch)'
} as const
