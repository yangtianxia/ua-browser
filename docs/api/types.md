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
}
```

---

## BrowserName

```typescript
type BrowserName =
  | 'Safari' | 'Chrome' | 'IE' | 'Edge' | 'Firefox' | 'Firefox Focus'
  | 'Firefox Nightly' | 'Chromium' | 'Opera' | 'Vivaldi' | 'Yandex'
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
  | 'WebOS' | 'unknown'
```

---

## DeviceName

```typescript
type DeviceName = 'Mobile' | 'Tablet' | 'PC'
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
  nav?:            NavContext       // 注入浏览器环境上下文（浏览器端按需传入）
  windowsVersion?: string | null   // 预先 await getWindowsVersion() 的结果
}
```
