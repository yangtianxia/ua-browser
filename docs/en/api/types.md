# Type Definitions

## EnvOption

The return type of `uaBrowser()` and `parseUA()`.

```typescript
interface EnvOption {
  browser:        BrowserName
  version:        string
  versionMajor:   number
  browserType:    BrowserType      // 'browser' | 'brand' | 'app' | 'unknown'
  engine:         EngineName
  engineVersion:  string           // engine version, e.g. '537.36', '605.1.15'
  os:             OsName
  osVersion:      string
  osVersionName:  string           // e.g. 'Sonoma', 'Windows 11'; 'unknown' when unnamed
  device:         DeviceName
  vendor:         string           // device manufacturer, e.g. 'Samsung', 'Apple'; 'unknown' when unrecognized
  model:          string           // device model, e.g. 'SM-G991B', 'iPhone'; 'unknown' when unrecognized
  arch:           ArchName
  isWebview:      boolean
  isHeadless:     boolean
  isBot:          boolean
  botName:        BotName
  botCategory:    BotCategory      // bot classification
  language:       string
  platform:       string
  connectionType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'
}
```

---

## BrowserName

```typescript
type BrowserName =
  | 'Safari' | 'Chrome' | 'Arc' | 'Brave' | 'IE' | 'Edge' | 'Firefox'
  | 'Firefox Focus' | 'Firefox Nightly' | 'Chromium' | 'Opera' | 'Vivaldi'
  | 'Yandex' | 'Samsung Internet' | 'DuckDuckGo' | 'Puffin' | 'Coc Coc'
  | 'Kindle' | 'Konqueror' | 'SeaMonkey' | 'Epiphany'
  | '360' | '360EE' | '360SE' | 'UC' | 'QQBrowser' | 'QQ' | 'Baidu'
  | 'Maxthon' | 'Sogou' | 'Liebao' | '2345Explorer' | '115Browser'
  | 'TheWorld' | 'XiaoMi' | 'Vivo' | 'Huawei' | 'OPPO' | 'Quark'
  | 'Qiyu' | 'Wechat' | 'Wechat Miniapp' | 'WechatWork' | 'Taobao'
  | 'Alipay' | 'Weibo' | 'Douban' | 'Suning' | 'iQiYi' | 'DingTalk'
  | 'Douyin' | 'Bilibili' | 'Kuaishou' | 'Xiaohongshu' | 'Feishu'
  | 'Toutiao' | 'JD' | 'Meituan' | 'unknown'
```

> **Arc**: UA contains the `Arc/X.X.X` token — pure UA detection. **Brave**: UA is identical to Chrome; only detectable in browser environments via `navigator.brave.isBrave()` (requires `uaBrowser.detect()` or passing `ctx`).

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
  | 'BlackBerry' | 'MeeGo' | 'Symbian' | 'iOS' | 'visionOS' | 'tvOS'
  | 'Chrome OS' | 'WebOS' | 'Tizen' | 'KaiOS' | 'unknown'
```

---

## DeviceName

```typescript
type DeviceName = 'Mobile' | 'Tablet' | 'PC' | 'TV' | 'Console' | 'XR' | 'unknown'
```

| Value | Description |
| :-- | :-- |
| `Mobile` | Smartphone |
| `Tablet` | Tablet |
| `PC` | Desktop computer |
| `TV` | Smart TV (Samsung Smart TV, HbbTV, etc.) |
| `Console` | Game console (PlayStation, Xbox, Nintendo Switch) |
| `XR` | Extended reality device (Apple Vision Pro, Meta Quest) |
| `unknown` | Unrecognized |

---

## ArchName

```typescript
type ArchName = 'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'
```

---

## BotName

```typescript
type BotName =
  // Search engines
  | 'Googlebot' | 'Bingbot' | 'Baiduspider' | 'Bytespider'
  | 'YandexBot' | 'DuckDuckBot' | 'Slurp' | 'Sogou' | '360Spider' | 'PetalBot'
  | 'Applebot-Extended' | 'Applebot'
  // Social media crawlers
  | 'Facebookbot' | 'Twitterbot' | 'LinkedInBot' | 'PinterestBot'
  // Messaging link preview bots
  | 'Slackbot' | 'Discordbot' | 'TelegramBot' | 'WhatsApp'
  // SEO tools
  | 'SemrushBot' | 'AhrefsBot' | 'MJ12bot' | 'ScreamingFrog' | 'DataForSeoBot'
  // AI / LLM crawlers
  | 'GPTBot' | 'OAI-SearchBot' | 'ChatGPT-User'
  | 'ClaudeBot' | 'PerplexityBot' | 'CCBot' | 'AdsBot'
  | 'Google-Extended' | 'Meta-ExternalAgent' | 'Amazonbot'
  | 'Diffbot' | 'cohere-ai' | 'YouBot'
  // Monitoring / archiving
  | 'UptimeRobot' | 'ia_archiver'
  // Generic catch-all
  | 'GenericBot' | 'unknown'
```

---

## BotCategory

```typescript
type BotCategory =
  | 'search-engine'   // Googlebot, Bingbot, Baiduspider, etc.
  | 'ai-llm'          // GPTBot, ClaudeBot, PerplexityBot, etc.
  | 'social'          // Facebookbot, Twitterbot, LinkedInBot, etc.
  | 'link-preview'    // Slackbot, Discordbot, TelegramBot, etc.
  | 'seo-tool'        // SemrushBot, AhrefsBot, MJ12bot, etc.
  | 'monitoring'      // UptimeRobot, ia_archiver, etc.
  | 'generic'         // GenericBot catch-all
  | 'unknown'
```

---

## BrowserType

```typescript
type BrowserType =
  | 'browser'   // Standard browsers: Chrome, Firefox, Safari, Edge, etc.
  | 'brand'     // Regional/OEM browsers: UC, QQBrowser, 360SE, Huawei Browser, etc.
  | 'app'       // In-app browsers: WeChat, DingTalk, Douyin, Bilibili, etc.
  | 'unknown'
```

Derived from the `priority` field in `BROWSER_DEFS`: ≥500 → `'app'`, ≥300 → `'brand'`, otherwise `'browser'`.

---

## VendorModelResult

Return type of `detectVendorModel()`.

```typescript
interface VendorModelResult {
  vendor: string   // device manufacturer, e.g. 'Samsung', 'Apple', 'Google'; 'unknown' when unrecognized
  model:  string   // device model, e.g. 'SM-G991B', 'iPhone', 'Pixel 7'; 'unknown' when unrecognized
}
```

---

## NavContext

An injectable subset of the browser environment, used to isolate side effects and enable testing. `getNavContext()` reads the real `navigator` in browsers and returns an empty object in Node.js.

```typescript
interface NavContext {
  userAgent:        string
  platform:         string
  language:         string
  browserLanguage?: string
  maxTouchPoints:   number
  mimeTypes?:       MimeTypeArray
  connection?: {
    saveData?:       boolean
    effectiveType?:  '4g' | '3g' | '2g' | 'slow-2g'  // Network Information API
    rtt?:            number   // round-trip time in milliseconds
    downlink?:       number   // effective bandwidth in Mbps
  }
  userAgentData?: {
    platform: string
    getHighEntropyValues(hints: string[]): Promise<Record<string, string>>
  }
}
```

---

## EnvContext

Extends `NavContext` with additional hardware and browser signals collected by `getEnvContext()`. Pass to `parseUA({ ctx })` for multi-signal detection.

```typescript
interface EnvContext extends NavContext {
  // WebGL GPU
  webglRenderer?:           string   // e.g. 'Adreno (TM) 730', 'Apple GPU', 'ANGLE (Intel...)'
  webglVendor?:             string   // e.g. 'Qualcomm', 'Apple', 'Google Inc. (Intel)'
  webglMaxTextureSize?:     number   // mobile ≤8192; desktop ≥16384
  webglFragPrecision?:      number   // fragment shader float precision
  webglCompressedFormats?: {
    s3tc:  boolean   // DXT/BC formats — desktop GPU (DirectX lineage)
    pvrtc: boolean   // PowerVR — iOS only
    etc2:  boolean   // GLES 3.0+ — Android (Adreno/Mali/PowerVR)
    astc:  boolean   // Adreno 4xx+ / Mali Txx+ / Apple A8+
  }

  // Screen & display
  devicePixelRatio?:   number   // phone ≥3, MacBook 2, external monitor 1–2
  screenWidth?:        number
  screenHeight?:       number
  safeAreaInsetTop?:   number   // >0 on iOS with notch / Dynamic Island

  // Hardware APIs
  hardwareConcurrency?: number   // logical CPU cores
  deviceMemory?:        number   // RAM in GB (rounded, e.g. 4, 8)
  audioSampleRate?:     number   // typically 44100 or 48000
  hasVibration?:        boolean  // navigator.vibrate present — mobile browsers only
  hasDeviceMotion?:     boolean  // DeviceMotionEvent available — mobile sensor

  // Input
  pointerType?:      'coarse' | 'fine' | 'none'  // primary pointer precision
  hoverCapability?:  boolean                       // primary input supports hover

  // Client Hints (high entropy)
  highEntropyData?: UAHighEntropyValues  // result of getHighEntropyValues()
  windowsVersion?:  string | null        // resolved by getWindowsVersion()

  // Font probes
  fontProbes?: Record<string, boolean>  // OS-specific font availability

  // Browser features
  hasBrave?: boolean  // navigator.brave.isBrave() — true only in Brave browser
}
```

---

## ParseOptions

The second argument to `parseUA()`.

```typescript
interface ParseOptions {
  nav?:            NavContext           // inject browser environment context
  windowsVersion?: string | null       // pre-resolved result of getWindowsVersion()
  ctx?:            EnvContext          // return value of getEnvContext(); takes priority over nav and windowsVersion
  customBotDefs?:  readonly BotDef[]   // custom bot rules, inserted before the GenericBot catch-all
  language?:       string              // explicit language override (BCP47), highest priority, useful for server-side Accept-Language
}
```
