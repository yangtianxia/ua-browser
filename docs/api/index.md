# API 参考

## 默认导出

### `uaBrowser(ua?)`

同步解析 UA 字符串，返回完整的环境信息对象。在浏览器环境中自动读取 `navigator.userAgent` 并注入 `navigator` 上下文（语言、平台、触控点数）。

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(ua?: string, options?: { strategy?: DetectStrategy }): EnvOption
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 否 | 要解析的 UA 字符串，省略时自动读取 `navigator.userAgent` |
| `options.strategy` | [`DetectStrategy`](/api/types#detectstrategy) | 否 | 信号裁决策略，默认 `'auto'` |

**返回值：** [`EnvOption`](/api/types#envoption)

**示例：**

```typescript
// 在浏览器中自动读取 navigator.userAgent
const info = uaBrowser()
console.log(info.browser)    // 'Chrome'
console.log(info.os)         // 'Windows'
console.log(info.confidence) // 'low' — 纯 UA 字符串

// 传入指定 UA 字符串
const info2 = uaBrowser('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 ...')
console.log(info2.device) // 'Mobile'
```

**注意事项：**
- 无法判断的字段返回 `'unknown'`，不会返回空字符串。
- `confidence` 始终为 `'low'`，因为此函数不采集硬件信号。
- 在 Node.js 中 `navigator` 不可用，`language` 和 `platform` 将为 `'unknown'`。
- 若需要更高精度，浏览器端请使用 [`uaBrowser.detect()`](#uabrowser-detect)。

默认导出对象同时挂载了以下静态成员：

```typescript
uaBrowser.detect(ua?: string, options?: { strategy?: DetectStrategy }): Promise<EnvOption>
uaBrowser.isWebview(ua: string): boolean
uaBrowser.getLanguage(): string
uaBrowser.VERSION: string
```

---

### `uaBrowser.detect(ua?)`

`uaBrowser()` 的异步高精度版本。内部先调用 [`getEnvContext()`](#getenvcontext) 采集硬件与浏览器信号，再执行解析，返回的 `confidence` 通常为 `'medium'` 或 `'high'`。

**这是浏览器端代码的推荐入口。**

```typescript
uaBrowser.detect(ua?: string, options?: { strategy?: DetectStrategy }): Promise<EnvOption>
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 否 | UA 字符串，省略时自动读取 `navigator.userAgent` |
| `options.strategy` | [`DetectStrategy`](/api/types#detectstrategy) | 否 | 信号裁决策略，默认 `'auto'` |

**返回值：** `Promise<`[`EnvOption`](/api/types#envoption)`>`

**`detect()` 采集的信号：**

| 信号 | 用途 |
| :-- | :-- |
| Client Hints (`Sec-CH-UA-*`) | 精确版本、平台、架构 |
| WebGL 渲染器 / 厂商 | GPU 类型 → 判断移动端 vs. 桌面端、Apple Silicon vs. Intel |
| CSS `env(safe-area-inset-top)` | iOS 刘海 / 灵动岛 → 确认为移动设备 |
| `devicePixelRatio` | 手机（≥3）vs. Mac（2）vs. 显示器（1–2） |
| 振动 / DeviceMotion API | 仅移动端有效 → 确认移动设备意图 |
| 网络类型（`connection.effectiveType`）| 辅助设备分类 |
| 字体探针 | 操作系统级字体可用性 |

**示例：**

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()
console.log(result.device)     // 'Mobile' — 即便开了桌面模式也能正确识别
console.log(result.arch)       // 'arm64' 或 'x86_64'
console.log(result.confidence) // 'medium'（Client Hints 可用时为 'high'）
```

**注意事项：**
- 仅限浏览器环境。在 Node.js 中 `getEnvContext()` 返回空上下文，结果等同于 `uaBrowser()`。
- 所有 DOM 访问均包裹在 `try/catch` 中，不会抛出异常。

---

## 命名导出

### `parseUA(ua, options?)`

纯函数版本：无全局状态、无 DOM 访问。适合 SSR、Node.js 及单元测试。

```typescript
import { parseUA } from 'ua-browser'

parseUA(ua: string, options?: ParseOptions): EnvOption
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | 要解析的 UA 字符串 |
| `options` | [`ParseOptions`](/api/types#parseoptions) | 否 | 注入上下文，详见下表 |

**`ParseOptions` 字段：**

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| `nav` | [`NavContext`](/api/types#navcontext) | 浏览器环境子集（语言、平台、触控点数）。使用 `getNavContext()` 从 `navigator` 读取。 |
| `windowsVersion` | `string \| null` | 由 `getWindowsVersion()` 预先获取的 Windows 版本，用于区分 Windows 10 / 11。 |
| `ctx` | [`EnvContext`](/api/types#envcontext) | `getEnvContext()` 的返回值，包含完整多信号上下文。**同时传入时优先级高于 `nav` 和 `windowsVersion`**。 |
| `customBotDefs` | `readonly BotDef[]` | 自定义 Bot 检测规则，插在 `GenericBot` 兜底之前，不影响全局状态。 |
| `strategy` | [`DetectStrategy`](/api/types#detectstrategy) | 信号裁决策略，控制信号冲突时的处理方式。默认 `'auto'`。 |

**返回值：** [`EnvOption`](/api/types#envoption)

**示例：**

```typescript
// 最简用法：仅 UA 字符串（confidence: 'low'）
const result = parseUA(navigator.userAgent)

// 注入 navigator 上下文（confidence: 'low'，但 language/platform 已填充）
import { parseUA, getNavContext } from 'ua-browser'
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })
console.log(result.language) // 'zh-CN'
console.log(result.platform) // 'Win32'

// 注入完整环境上下文（confidence: 'medium'）
import { parseUA, getEnvContext } from 'ua-browser'
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })
console.log(result.arch)     // 'arm64'（基于 WebGL / Client Hints）

// 自定义 Bot 规则
import { parseUA } from 'ua-browser'
import type { BotDef } from 'ua-browser'
const myBots: BotDef[] = [{ name: 'GenericBot', detect: /MyInternalCrawler/ }]
const result = parseUA(ua, { customBotDefs: myBots })

// hardware-first：Client Hints / 硬件信号优先，忽略被篡改的 UA
import { parseUA, getEnvContext } from 'ua-browser'
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx, strategy: 'hardware-first' })
// 例：Mac Chrome DevTools 开启 Android 模拟时：
// result.os     → 'MacOS'  （来自 Client Hints，而非伪造的 UA）
// result.device → 'PC'     （来自 ANGLE 渲染器，而非 UA）
// result.confidence → 'high'

// strict：信号矛盾的字段返回 'unknown'
const result = parseUA(navigator.userAgent, { ctx, strategy: 'strict' })
// result.os         → 'unknown'   （UA 说 Android，platform 说 MacOS）
// result.confidence → 'conflict'
```

---

### `parseHeaders(headers)`

从 HTTP 请求头中解析 UA 及 Client Hints，返回 [`EnvOption`](/api/types#envoption)。适用于 SSR 精准检测场景。

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

parseHeaders(headers: Record<string, string | string[] | undefined>): EnvOption
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `headers` | `Record<string, string \| string[] \| undefined>` | 是 | HTTP 请求头对象（如 Express / Next.js 中的 `req.headers`） |

**返回值：** [`EnvOption`](/api/types#envoption)

**可读取的 Client Hints 请求头：**

| 请求头 | 数据 |
| :-- | :-- |
| `user-agent` | 完整 UA 字符串 |
| `sec-ch-ua` | 浏览器品牌列表 |
| `sec-ch-ua-full-version-list` | 精确浏览器版本 → `confidence: 'high'` |
| `sec-ch-ua-platform` | 操作系统名称 |
| `sec-ch-ua-platform-version` | OS 版本（可区分 Windows 10 / 11） |
| `sec-ch-ua-arch` | CPU 架构（如 `x86`、`arm`） |
| `sec-ch-ua-mobile` | 移动端标识 |

**两阶段请求流程：**

首次请求时浏览器只发送 `user-agent`。在响应中返回 `ACCEPT_CH`，告知支持的浏览器后续请求附带 Client Hints。

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// 第一次响应——告知浏览器上报 Client Hints
res.setHeader('Accept-CH', ACCEPT_CH)

// 后续请求携带 Client Hints 后
const result = parseHeaders(req.headers)
console.log(result.arch)       // 'x86_64'（来自 Sec-CH-UA-Arch）
console.log(result.os)         // 'Windows'
console.log(result.confidence) // 'high'（Sec-CH-UA-Full-Version-List 存在时）
```

**注意事项：**
- 兼容 Express、Koa、Next.js API Route、Fastify、Hono 等任何以普通对象形式暴露请求头的框架。
- Client Hints 请求头缺失时回退到纯 UA 解析（`confidence: 'low'`）。

---

### `getEnvContext()`

一次性采集当前浏览器的所有可用信号，返回 [`EnvContext`](/api/types#envcontext) 对象，再传给 `parseUA({ ctx })` 以启用多信号检测。

```typescript
import { getEnvContext } from 'ua-browser'

getEnvContext(): Promise<EnvContext>
```

**返回值：** `Promise<`[`EnvContext`](/api/types#envcontext)`>`

**采集的信号：**

| 类别 | 信号 |
| :-- | :-- |
| Client Hints | `platform`、`platformVersion`、`architecture`、`fullVersionList` |
| WebGL | GPU 渲染器 + 厂商、最大纹理尺寸、压缩纹理格式（ASTC/ETC2/PVRTC/S3TC） |
| 屏幕 | `devicePixelRatio`、`screenWidth`、`screenHeight` |
| CSS env | `safe-area-inset-top`（iOS 刘海 / 灵动岛） |
| 硬件 API | `hardwareConcurrency`、`deviceMemory`、振动 API、DeviceMotion 事件 |
| 输入 | `pointerType`（`coarse`/`fine`/`none`）、hover 能力 |
| 网络 | `connection.effectiveType`、`connection.saveData` |
| 音频 | 采样率 |
| 字体 | 操作系统专属字体可用性探针 |

**示例：**

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.device)     // 'Mobile' — 开了桌面模式也能正确识别
console.log(result.arch)       // 'arm64'（Apple Silicon）或 'x86_64'（Intel）
console.log(result.language)   // 'zh-CN'
console.log(result.confidence) // 'medium'（Client Hints 可用时为 'high'）
```

**注意事项：**
- 仅限浏览器环境。在 Node.js 中调用是安全的——所有 DOM 访问均有保护，返回 `undefined`，结果等同于 `getNavContext()`。
- 每个 DOM API 均单独包裹在 `try/catch` 中，单个权限拒绝不会阻断其余信号采集。
- 如果不需要复用 `ctx` 对象，直接使用 `uaBrowser.detect()` 更简洁。

---

### `getWindowsVersion(nav)`

异步获取精确的 Windows 版本，用于区分 Windows 10 与 Windows 11（两者 UA 字符串相同，均为 `Windows NT 10.0`）。

```typescript
import { getWindowsVersion, getNavContext, parseUA } from 'ua-browser'

getWindowsVersion(nav: NavContext): Promise<string | null>
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `nav` | [`NavContext`](/api/types#navcontext) | 是 | 浏览器上下文，传入 `getNavContext()` 的返回值 |

**返回值：** `Promise<string | null>` — 版本字符串（如 `'11'`、`'10'`）或 `null`（不可用时）

**示例：**

```typescript
const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '11' 或 '10'
```

**注意事项：**
- 依赖 `navigator.userAgentData.getHighEntropyValues()`（Chrome 90+、Edge 90+）。
- Firefox、Safari 及 Node.js 返回 `null`，`osVersion` 回退到 UA 派生值。
- `getEnvContext()` 内部已调用此函数；仅在需要 `NavContext` 级上下文而不想承担完整 `EnvContext` 开销时才单独使用。

---

### `detectBot(ua, customDefs?)`

独立爬虫检测器，不运行完整 `parseUA()` 流水线。

```typescript
import { detectBot } from 'ua-browser'
import type { BotDef } from 'ua-browser'

detectBot(ua: string, customDefs?: readonly BotDef[]): { isBot: boolean; botName: BotName }
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | 要检测的 UA 字符串 |
| `customDefs` | `readonly BotDef[]` | 否 | 附加 Bot 规则，插在内置规则之后、`GenericBot` 兜底之前 |

**返回值：** `{ isBot: boolean; botName: BotName }`

**`BotDef` 结构：**

```typescript
interface BotDef {
  name: BotName   // 匹配后返回的 botName 值
  detect: RegExp  // 与 UA 字符串匹配的正则
}
```

**示例：**

```typescript
const { isBot, botName } = detectBot(ua)
// isBot: true, botName: 'Googlebot'

// 自定义规则
const myDefs: BotDef[] = [
  { name: 'GenericBot', detect: /MyInternalCrawler/ }
]
detectBot(ua, myDefs)

// 或通过 parseUA 透传，获得完整结果
parseUA(ua, { customBotDefs: myDefs })
```

**注意事项：**
- 内置规则覆盖 30+ 种 Bot，包含 AI 训练爬虫（GPTBot、ClaudeBot、PerplexityBot、CCBot 等）。
- `customDefs` 不修改任何全局状态。

---

### `detectArch(ua, ctx?)`

独立 CPU 架构检测器。不传 `ctx` 时仅依赖 UA 字符串启发式推断。

```typescript
import { detectArch } from 'ua-browser'

detectArch(ua: string, ctx?: EnvContext): ArchName
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | UA 字符串 |
| `ctx` | [`EnvContext`](/api/types#envcontext) | 否 | `getEnvContext()` 的返回值，启用 GPU 和 Client Hints 检测 |

**返回值：** [`ArchName`](/api/types#archname) — `'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'`

**检测优先级链：**

1. Client Hints `Sec-CH-UA-Arch`（最高精度）
2. WebGL 渲染器字符串（ANGLE → x86/x86_64；Apple GPU → arm64；Adreno/Mali → arm64）
3. `navigator.platform`（如 `'Win32'` → x86_64；`'iPhone'` → arm64）
4. UA 字符串模式（最低精度——受 UA 冻结影响）

**示例：**

```typescript
import { detectArch, getEnvContext } from 'ua-browser'

const ctx = await getEnvContext()
const arch = detectArch(navigator.userAgent, ctx)
// Apple Silicon 上返回 'arm64'，Intel Mac 上返回 'x86_64'
```

---

### `detectHeadless(ua)`

检测 UA 字符串是否表明当前为无头浏览器。

```typescript
import { detectHeadless } from 'ua-browser'

detectHeadless(ua: string): boolean
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | 要检测的 UA 字符串 |

**返回值：** `boolean`

**可检测的标识：** `HeadlessChrome`、`Headless`、`PhantomJS`、`SlimerJS`、`Nightmare`、`Puppeteer`、`Playwright`、`jsdom` 等常见无头标识。

**示例：**

```typescript
detectHeadless('Mozilla/5.0 ... HeadlessChrome/124.0.0.0 ...')
// true
```

---

### `isWebview(ua)`

检测 UA 是否表明当前为嵌入式 WebView（Android Webview 或 iOS WKWebView）。

```typescript
import { isWebview } from 'ua-browser'

isWebview(ua: string): boolean
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | 要检测的 UA 字符串 |

**返回值：** `boolean`

**检测逻辑：**
- **Android Webview：** UA 包含 `; wv)` 标识符
- **iOS WKWebView：** Safari UA 同时缺少 `Version/` 和 `Safari/` token（WKWebView 会将它们移除）

**示例：**

```typescript
isWebview('Mozilla/5.0 (Linux; Android 10; K; wv) ...')   // true  （Android）
isWebview('Mozilla/5.0 (iPhone ...) ... Mobile/15E148')    // true  （iOS WKWebView）
isWebview('Mozilla/5.0 ... Version/17.4 ... Safari/604.1') // false （真实 Safari）
```

---

### `getNavContext()`

读取当前浏览器的 `navigator`，返回 [`NavContext`](/api/types#navcontext) 对象。在 Node.js 中返回安全的空对象，调用方无需做环境判断。

```typescript
import { getNavContext } from 'ua-browser'

getNavContext(): NavContext
```

**返回值：** [`NavContext`](/api/types#navcontext)

**示例：**

```typescript
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })

console.log(result.language) // 'zh-CN'
console.log(result.platform) // 'Win32'
```

**注意事项：**
- 同时需要架构 / 设备精度信号时，优先使用 `getEnvContext()`。
- `getNavContext()` 是同步的；`getEnvContext()` 是异步的。

---

### `getLanguage(nav)`

从 [`NavContext`](/api/types#navcontext) 中提取标准化的浏览器语言。将语言标签规范化为 BCP 47 格式（如 `'en-us'` → `'en-US'`，`'ZH_CN'` → `'zh-CN'`）。

```typescript
import { getLanguage, getNavContext } from 'ua-browser'

getLanguage(nav: NavContext): string
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `nav` | [`NavContext`](/api/types#navcontext) | 是 | 浏览器上下文 |

**返回值：** `string` — 标准化语言标签，如 `'zh-CN'`、`'en-US'`，不可用时返回 `'unknown'`。

**示例：**

```typescript
const nav = getNavContext()
console.log(getLanguage(nav)) // 'zh-CN'
```

---

### `ACCEPT_CH`

包含 `parseHeaders()` 可消费的所有 Client Hints 请求头名称的常量字符串。将其设置为 `Accept-CH` 响应头，以请求支持的浏览器（Chrome / Edge 90+）在后续请求中携带这些信息。

```typescript
import { ACCEPT_CH } from 'ua-browser'

ACCEPT_CH: string
// 'Sec-CH-UA, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Mobile'
```

**示例：**

```typescript
res.setHeader('Accept-CH', ACCEPT_CH)
res.setHeader('Vary', 'Sec-CH-UA, Sec-CH-UA-Full-Version-List')  // 推荐同时设置
```

---

### `VERSION`

当前库版本号字符串，与 `package.json` 中的 `version` 字段一致。

```typescript
import { VERSION } from 'ua-browser'

VERSION: string  // 例如 '1.5.0'
```
