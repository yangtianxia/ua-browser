# 类型定义

## EnvOption

`uaBrowser()` 和 `parseUA()` 的返回类型。

```typescript
interface EnvOption {
  browser:        BrowserName
  version:        string
  versionMajor:   number
  browserType:    BrowserType      // 'browser' | 'brand' | 'app' | 'unknown'
  engine:         EngineName
  engineVersion:  string           // 引擎版本，如 '537.36'、'605.1.15'
  os:             OsName
  osVersion:      string
  osVersionName:  string           // 如 'Sonoma'、'Windows 11'，无名称时为 'unknown'
  device:         DeviceName
  vendor:         string           // 设备厂商，如 'Samsung'、'Apple'，未知时为 'unknown'
  model:          string           // 设备型号，如 'SM-G991B'、'iPhone'，未知时为 'unknown'
  arch:           ArchName
  isWebview:      boolean
  isHeadless:     boolean
  isBot:          boolean
  botName:        BotName
  botCategory:    BotCategory      // Bot 分类
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

> **Arc**：UA 包含 `Arc/X.X.X` 标记，纯 UA 检测。**Brave**：UA 与 Chrome 完全相同，仅在浏览器环境下通过 `navigator.brave.isBrave()` 识别（需使用 `uaBrowser.detect()` 或传入 `ctx`）。

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

| 值 | 说明 |
| :-- | :-- |
| `Mobile` | 手机 |
| `Tablet` | 平板 |
| `PC` | 桌面电脑 |
| `TV` | 智能电视（Samsung Smart TV、HbbTV 等） |
| `Console` | 游戏主机（PlayStation、Xbox、Nintendo Switch） |
| `XR` | 扩展现实设备（Apple Vision Pro、Meta Quest） |
| `unknown` | 无法识别 |

---

## ArchName

```typescript
type ArchName = 'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'
```

---

## BotName

```typescript
type BotName =
  // 搜索引擎
  | 'Googlebot' | 'Bingbot' | 'Baiduspider' | 'Bytespider'
  | 'YandexBot' | 'DuckDuckBot' | 'Slurp' | 'Sogou' | '360Spider' | 'PetalBot'
  | 'Applebot-Extended' | 'Applebot'
  // 社交媒体爬虫
  | 'Facebookbot' | 'Twitterbot' | 'LinkedInBot' | 'PinterestBot'
  // 消息应用链接预览
  | 'Slackbot' | 'Discordbot' | 'TelegramBot' | 'WhatsApp'
  // SEO 工具
  | 'SemrushBot' | 'AhrefsBot' | 'MJ12bot' | 'ScreamingFrog' | 'DataForSeoBot'
  // AI / LLM 爬虫
  | 'GPTBot' | 'OAI-SearchBot' | 'ChatGPT-User'
  | 'ClaudeBot' | 'PerplexityBot' | 'CCBot' | 'AdsBot'
  | 'Google-Extended' | 'Meta-ExternalAgent' | 'Amazonbot'
  | 'Diffbot' | 'cohere-ai' | 'YouBot'
  // 监控 / 存档
  | 'UptimeRobot' | 'ia_archiver'
  // 通用兜底
  | 'GenericBot' | 'unknown'
```

---

## BotCategory

```typescript
type BotCategory =
  | 'search-engine'   // Googlebot、Bingbot、Baiduspider 等
  | 'ai-llm'          // GPTBot、ClaudeBot、PerplexityBot 等
  | 'social'          // Facebookbot、Twitterbot、LinkedInBot 等
  | 'link-preview'    // Slackbot、Discordbot、TelegramBot 等
  | 'seo-tool'        // SemrushBot、AhrefsBot、MJ12bot 等
  | 'monitoring'      // UptimeRobot、ia_archiver 等
  | 'generic'         // GenericBot 通用捕获
  | 'unknown'
```

---

## BrowserType

```typescript
type BrowserType =
  | 'browser'   // 标准/通用浏览器：Chrome、Firefox、Safari、Edge 等
  | 'brand'     // 品牌/地区浏览器：UC、QQBrowser、360SE、华为浏览器 等
  | 'app'       // App 内嵌浏览器：微信、钉钉、抖音、Bilibili 等
  | 'unknown'
```

由 `BROWSER_DEFS` 中的 `priority` 字段推导：≥500 为 `'app'`，≥300 为 `'brand'`，其余为 `'browser'`。

---

## VendorModelResult

`detectVendorModel()` 的返回类型。

```typescript
interface VendorModelResult {
  vendor: string   // 设备厂商，如 'Samsung'、'Apple'、'Google'，未知时为 'unknown'
  model:  string   // 设备型号，如 'SM-G991B'、'iPhone'、'Pixel 7'，未知时为 'unknown'
}
```

---

## NavContext

浏览器环境的可注入子集，用于隔离副作用、方便测试。`getNavContext()` 在浏览器中读取真实的 `navigator`，在 Node.js 中返回空对象。

```typescript
interface NavContext {
  userAgent:        string
  platform:         string
  language:         string
  browserLanguage?: string
  maxTouchPoints:   number
  mimeTypes?:       MimeTypeArray
  connection?: {
    saveData?:      boolean
    effectiveType?: '4g' | '3g' | '2g' | 'slow-2g'  // Network Information API
    rtt?:           number   // 往返时延（毫秒）
    downlink?:      number   // 有效带宽（Mbps）
  }
  userAgentData?: {
    platform: string
    getHighEntropyValues(hints: string[]): Promise<Record<string, string>>
  }
}
```

---

## EnvContext

继承自 `NavContext`，附加 `getEnvContext()` 采集的硬件与浏览器信号。传给 `parseUA({ ctx })` 以启用多信号检测。

```typescript
interface EnvContext extends NavContext {
  // WebGL GPU
  webglRenderer?:           string   // 如 'Adreno (TM) 730'、'Apple GPU'、'ANGLE (Intel...)'
  webglVendor?:             string   // 如 'Qualcomm'、'Apple'、'Google Inc. (Intel)'
  webglMaxTextureSize?:     number   // 移动端 ≤8192；桌面端 ≥16384
  webglFragPrecision?:      number   // 片元着色器浮点精度
  webglCompressedFormats?: {
    s3tc:  boolean   // DXT/BC 格式——桌面 GPU（DirectX 系）
    pvrtc: boolean   // PowerVR——仅 iOS
    etc2:  boolean   // GLES 3.0+——Android（Adreno/Mali/PowerVR）
    astc:  boolean   // Adreno 4xx+ / Mali Txx+ / Apple A8+
  }

  // 屏幕与显示
  devicePixelRatio?:   number   // 手机 ≥3，MacBook 2，外接显示器 1–2
  screenWidth?:        number
  screenHeight?:       number
  safeAreaInsetTop?:   number   // >0 表示 iOS 刘海 / 灵动岛设备

  // 硬件 API
  hardwareConcurrency?: number   // 逻辑 CPU 核心数
  deviceMemory?:        number   // 内存 GB（取整值，如 4、8）
  audioSampleRate?:     number   // 通常为 44100 或 48000
  hasVibration?:        boolean  // navigator.vibrate 存在——仅移动端浏览器
  hasDeviceMotion?:     boolean  // DeviceMotionEvent 可用——移动端传感器

  // 输入
  pointerType?:      'coarse' | 'fine' | 'none'  // 主指针精度
  hoverCapability?:  boolean                       // 主输入设备是否支持 hover

  // Client Hints（高熵值）
  highEntropyData?: UAHighEntropyValues  // getHighEntropyValues() 的返回值
  windowsVersion?:  string | null        // getWindowsVersion() 的解析结果

  // 字体探针
  fontProbes?: Record<string, boolean>  // 操作系统特有字体可用性

  // 浏览器特征
  hasBrave?: boolean  // navigator.brave.isBrave() — 仅 Brave 浏览器返回 true
}
```

---

## ParseOptions

`parseUA()` 的第二个参数。

```typescript
interface ParseOptions {
  nav?:            NavContext           // 注入浏览器环境上下文（浏览器端按需传入）
  windowsVersion?: string | null       // 预先 await getWindowsVersion() 的结果
  ctx?:            EnvContext          // getEnvContext() 的返回值，优先级高于 nav 和 windowsVersion
  customBotDefs?:  readonly BotDef[]   // 自定义 Bot 规则，插在 GenericBot 兜底之前
  language?:       string              // 显式语言覆盖（BCP47），优先级最高，适合服务端传入 Accept-Language
}
```
