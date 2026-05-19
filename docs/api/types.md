# 类型定义

## EnvOption

`uaBrowser()` 和 `parseUA()` 的返回类型。

```typescript
interface EnvOption {
  browser:    BrowserName
  version:    string
  engine:     EngineName
  os:         OsName
  osVersion:  string
  device:     DeviceName
  arch:       ArchName
  isWebview:  boolean
  isHeadless: boolean
  isBot:      boolean
  botName:    BotName
  language:   string
  platform:   string
  confidence: 'high' | 'medium' | 'low'
}
```

`confidence` 反映检测结果的可信度：
- `'high'`：Client Hints `fullVersionList` 提供了精确版本（Chrome/Edge/Opera/Vivaldi）
- `'medium'`：传入了 `ctx`，多信号辅助检测（WebGL、平台信息等）
- `'low'`：纯 UA 字符串解析，UA 冻结后精度最低

---

## BrowserName

```typescript
type BrowserName =
  | 'Safari' | 'Chrome' | 'IE' | 'Edge' | 'Firefox' | 'Firefox Focus'
  | 'Firefox Nightly' | 'Chromium' | 'Opera' | 'Vivaldi' | 'Yandex'
  | 'Samsung Internet' | 'DuckDuckGo' | 'Puffin' | 'Coc Coc' | 'Kindle'
  | 'Konqueror' | 'SeaMonkey' | 'Epiphany'
  | '360' | '360EE' | '360SE' | 'UC' | 'QQBrowser' | 'QQ' | 'Baidu'
  | 'Maxthon' | 'Sogou' | 'Liebao' | '2345Explorer' | '115Browser'
  | 'TheWorld' | 'XiaoMi' | 'Vivo' | 'Huawei' | 'OPPO' | 'Quark'
  | 'Qiyu' | 'Wechat' | 'Wechat Miniapp' | 'WechatWork' | 'Taobao'
  | 'Alipay' | 'Weibo' | 'Douban' | 'Suning' | 'iQiYi' | 'DingTalk'
  | 'Douyin' | 'Bilibili' | 'Kuaishou' | 'Xiaohongshu' | 'Feishu'
  | 'Toutiao' | 'JD' | 'Meituan' | 'unknown'
```

---

## EngineName

```typescript
type EngineName =
  | 'Trident' | 'Presto' | 'WebKit' | 'Gecko'
  | 'KHTML' | 'Blink' | 'EdgeHTML' | 'ArkWeb' | 'unknown'
```

---

## OsName

```typescript
type OsName =
  | 'Windows' | 'Linux' | 'MacOS' | 'Android' | 'HarmonyOS' | 'OpenHarmony'
  | 'Ubuntu' | 'FreeBSD' | 'Debian' | 'Windows Phone'
  | 'BlackBerry' | 'MeeGo' | 'Symbian' | 'iOS' | 'Chrome OS'
  | 'WebOS' | 'Tizen' | 'KaiOS' | 'unknown'
```

---

## DeviceName

```typescript
type DeviceName = 'Mobile' | 'Tablet' | 'TV' | 'PC'
```

---

## ArchName

```typescript
type ArchName = 'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'
```

---

## BotName

```typescript
type BotName =
  | 'Googlebot' | 'Bingbot' | 'Baiduspider' | 'Bytespider'
  | 'YandexBot' | 'DuckDuckBot' | 'Slurp' | 'Sogou' | '360Spider'
  | 'Applebot-Extended' | 'Applebot'
  | 'Facebookbot' | 'Twitterbot' | 'LinkedInBot'
  | 'SemrushBot' | 'AhrefsBot' | 'MJ12bot' | 'PetalBot'
  | 'GPTBot' | 'OAI-SearchBot' | 'ChatGPT-User'
  | 'ClaudeBot' | 'PerplexityBot' | 'CCBot' | 'AdsBot'
  | 'Google-Extended' | 'Meta-ExternalAgent' | 'Amazonbot'
  | 'Diffbot' | 'cohere-ai' | 'YouBot'
  | 'GenericBot' | 'unknown'
```

---

## NavContext

浏览器环境的可注入子集，用于隔离副作用、方便测试。`getNavContext()` 在浏览器中读取真实的 `navigator`，在 Node.js 中返回空对象。

```typescript
interface NavContext {
  userAgent:       string
  platform:        string
  language:        string
  browserLanguage?: string
  maxTouchPoints:  number
  mimeTypes?:      MimeTypeArray
  connection?: {
    saveData?: boolean
  }
  userAgentData?: {
    platform: string
    getHighEntropyValues(hints: string[]): Promise<Record<string, string>>
  }
}
```

---

## ParseOptions

`parseUA()` 的第二个参数。

```typescript
interface ParseOptions {
  nav?:            NavContext          // 注入浏览器环境上下文（浏览器端按需传入）
  windowsVersion?: string | null      // 预先 await getWindowsVersion() 的结果
  ctx?:            EnvContext         // getEnvContext() 的返回值，优先级高于 nav 和 windowsVersion
  customBotDefs?:  readonly BotDef[]  // 自定义 Bot 规则，插在 GenericBot 兜底之前
}
```
