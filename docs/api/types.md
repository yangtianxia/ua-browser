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
  confidence: 'high' | 'medium' | 'low' | 'conflict'
}
```

`confidence` 反映检测结果的可信度：
- `'high'`：Client Hints `fullVersionList` 提供了精确版本（Chrome/Edge/Opera/Vivaldi）
- `'medium'`：传入了 `ctx`，多信号辅助检测（WebGL、平台信息等）
- `'low'`：纯 UA 字符串解析，UA 冻结后精度最低
- `'conflict'`：使用了 `strategy: 'strict'` 且检测到相互矛盾的信号；冲突字段被设为 `'unknown'`

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
}
```

---

## DetectStrategy

控制 `parseUA()` 在硬件信号与 UA 字符串不一致时的裁决方式。

```typescript
type DetectStrategy = 'auto' | 'ua-first' | 'hardware-first' | 'strict'
```

| 值 | 行为 | `confidence` |
| :-- | :-- | :-- |
| `'auto'` | 默认。库内部自行决定信号优先级（当前行为）。 | 不变 |
| `'ua-first'` | UA 字符串为主要来源。硬件信号仅补充 UA 无法提供的字段（`arch`、`language`、`platform`）。 | `'medium'` 或 `'low'` |
| `'hardware-first'` | Client Hints 及硬件信号优先。UA 仅填补硬件无法感知的字段（如 `browser`、`engine`）。DevTools 设备模拟场景下的浏览器端推荐策略。 | `'high'` 或 `'medium'` |
| `'strict'` | 独立运行 UA 和硬件两套检测逻辑。任何字段如两者结论不一致，该字段设为 `'unknown'`。 | 存在矛盾时为 `'conflict'` |

---

## ParseOptions

`parseUA()` 的第二个参数。

```typescript
interface ParseOptions {
  nav?:            NavContext           // 注入浏览器环境上下文（浏览器端按需传入）
  windowsVersion?: string | null       // 预先 await getWindowsVersion() 的结果
  ctx?:            EnvContext          // getEnvContext() 的返回值，优先级高于 nav 和 windowsVersion
  customBotDefs?:  readonly BotDef[]   // 自定义 Bot 规则，插在 GenericBot 兜底之前
  strategy?:       DetectStrategy      // 信号裁决策略，默认 'auto'
}
```
