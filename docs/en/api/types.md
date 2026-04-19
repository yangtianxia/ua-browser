# Type Definitions

## EnvOption

The return type of `uaBrowser()` and `parseUA()`.

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
}
```

---

## BrowserName

```typescript
type BrowserName =
  | 'Safari' | 'Chrome' | 'IE' | 'Edge' | 'Firefox' | 'Firefox Focus'
  | 'Firefox Nightly' | 'Chromium' | 'Opera' | 'Vivaldi' | 'Yandex'
  | 'Samsung Internet' | 'DuckDuckGo' | 'Puffin'
  | 'Arora' | 'Lunascape' | 'QupZilla' | 'Coc Coc' | 'Kindle'
  | 'Iceweasel' | 'Konqueror' | 'Iceape' | 'SeaMonkey' | 'Epiphany'
  | '360' | '360EE' | '360SE' | 'UC' | 'QQBrowser' | 'QQ' | 'Baidu'
  | 'Maxthon' | 'Sogou' | 'Liebao' | '2345Explorer' | '115Browser'
  | 'TheWorld' | 'XiaoMi' | 'Vivo' | 'Huawei' | 'OPPO' | 'Quark'
  | 'Qiyu' | 'Wechat' | 'Wechat Miniapp' | 'WechatWork' | 'Taobao'
  | 'Alipay' | 'Weibo' | 'Douban' | 'Suning' | 'iQiYi' | 'DingTalk'
  | 'Douyin' | 'unknown'
```

---

## EngineName

```typescript
type EngineName =
  | 'Trident' | 'Presto' | 'WebKit' | 'Gecko'
  | 'KHTML' | 'Blink' | 'EdgeHTML' | 'unknown'
```

---

## OsName

```typescript
type OsName =
  | 'Windows' | 'Linux' | 'MacOS' | 'Android' | 'HarmonyOS'
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
  | 'Applebot' | 'Facebookbot' | 'Twitterbot' | 'LinkedInBot'
  | 'SemrushBot' | 'AhrefsBot' | 'MJ12bot' | 'PetalBot'
  | 'GPTBot' | 'ClaudeBot' | 'PerplexityBot' | 'CCBot' | 'AdsBot'
  | 'GenericBot' | 'unknown'
```

---

## NavContext

An injectable subset of the browser environment, used to isolate side effects and enable testing. `getNavContext()` reads the real `navigator` in browsers and returns an empty object in Node.js.

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

The second argument to `parseUA()`.

```typescript
interface ParseOptions {
  nav?:            NavContext       // inject browser environment context
  windowsVersion?: string | null   // pre-resolved result of getWindowsVersion()
}
```
