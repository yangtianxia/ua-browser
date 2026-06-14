---
title: 独立检测器
description: detectBot()、detectBrowser()、detectOS() 等独立检测器的 API 文档，支持按需引入。
---

# 独立检测器


---

独立检测器不运行完整的 `parseUA()` 流水线，适合只需要单项检测能力的场景，可配合 tree-shaking 减小打包体积。


---

## `detectBot(ua, customDefs?)` {#detectbot}

独立爬虫检测器，不运行完整 `parseUA()` 流水线。

```typescript
import { detectBot } from 'ua-browser'
import type { BotDef } from 'ua-browser'

detectBot(ua: string, customDefs?: readonly BotDef[]): { isBot: boolean; botName: BotName; botCategory: BotCategory }
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | 要检测的 UA 字符串 |
| `customDefs` | `readonly BotDef[]` | 否 | 附加 Bot 规则，插在内置规则之后、`GenericBot` 兜底之前 |

**返回值：** `{ isBot: boolean; botName: BotName; botCategory: BotCategory }`

**`BotDef` 结构：**

```typescript
interface BotDef {
  name: BotName         // 匹配后返回的 botName 值
  detect: RegExp        // 与 UA 字符串匹配的正则
  category: BotCategory // Bot 分类
}
```

**示例：**

```typescript
const { isBot, botName, botCategory } = detectBot(ua)
// isBot: true, botName: 'Googlebot', botCategory: 'search-engine'

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

---

## `detectBrowser(ua)` {#detectbrowser}

独立浏览器检测器，不运行完整 `parseUA()` 流水线。

```typescript
import { detectBrowser } from 'ua-browser'

detectBrowser(ua: string): { browser: BrowserName; version: string; browserType: BrowserType }
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | UA 字符串 |

**返回值：** `{ browser: BrowserName; version: string; browserType: BrowserType }`

**示例：**

```typescript
const { browser, version, browserType } = detectBrowser(navigator.userAgent)
// browser: 'Chrome', version: '124.0.0.0', browserType: 'browser'
```

---

---

## `detectOS(ua)` {#detectos}

独立操作系统检测器，不运行完整 `parseUA()` 流水线。

```typescript
import { detectOS } from 'ua-browser'

detectOS(ua: string): { os: OsName; osVersion: string; osVersionName: string }
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | UA 字符串 |

**返回值：** `{ os: OsName; osVersion: string; osVersionName: string }`

**示例：**

```typescript
const { os, osVersion, osVersionName } = detectOS(navigator.userAgent)
// os: 'Windows', osVersion: '10', osVersionName: 'Windows 10'
```

---

---

## `detectEngine(ua)` {#detectengine}

独立渲染引擎检测器，不运行完整 `parseUA()` 流水线。

```typescript
import { detectEngine } from 'ua-browser'

detectEngine(ua: string): { engine: EngineName; engineVersion: string }
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | UA 字符串 |

**返回值：** `{ engine: EngineName; engineVersion: string }`

**示例：**

```typescript
const { engine, engineVersion } = detectEngine(navigator.userAgent)
// engine: 'Blink', engineVersion: '537.36'
```

---

---

## `detectDevice(ua)` {#detectdevice}

独立设备类型检测器，不运行完整 `parseUA()` 流水线。仅基于 UA 字符串推断，不使用硬件信号。

```typescript
import { detectDevice } from 'ua-browser'

detectDevice(ua: string): DeviceName
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | UA 字符串 |

**返回值：** [`DeviceName`](/api/types#devicename)

**示例：**

```typescript
const device = detectDevice(navigator.userAgent)
// device: 'Mobile'
```

---

---

## `detectVendorModel(ua)` {#detectvendormodel}

独立设备厂商/型号提取器。

```typescript
import { detectVendorModel } from 'ua-browser'

detectVendorModel(ua: string): VendorModelResult
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | UA 字符串 |

**返回值：** [`VendorModelResult`](/api/types#vendormodelresult)

**示例：**

```typescript
const { vendor, model } = detectVendorModel(ua)
// vendor: 'Samsung', model: 'SM-G991B'
```

---

---

## `detectArch(ua, ctx?)` {#detectarch}

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

---

## `detectHeadless(ua)` {#detectheadless}

检测 UA 字符串是否表明当前为无头浏览器。

```typescript
import { detectHeadless } from 'ua-browser'

detectHeadless(ua: string): boolean
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | 是 | 要检测的 UA 字符串 |

**返回值：** `boolean`

**可检测的标识：** `HeadlessChrome`、`Headless`、`PhantomJS`、`Electron`、`Playwright`、`jsdom`、`Selenium`。

> 现代 Puppeteer / Playwright 使用隐身模式可隐藏上述标识，此函数仅覆盖未经伪装的常见场景。

**示例：**

```typescript
detectHeadless('Mozilla/5.0 ... HeadlessChrome/124.0.0.0 ...')
// true
```

---

---

## `isWebview(ua)` {#iswebview}

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

---

## `satisfies(info, criteria)` {#satisfies}

条件匹配辅助函数。支持 TypeScript 类型检查，比手写 `&&` 链更简洁。

```typescript
import { satisfies } from 'ua-browser'

satisfies(info: EnvOption, criteria: Partial<EnvOption>): boolean
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `info` | [`EnvOption`](/api/types#envoption) | 是 | `parseUA()` 或 `uaBrowser()` 的返回值 |
| `criteria` | `Partial<EnvOption>` | 是 | 要匹配的字段子集 |

**返回值：** `boolean`

**示例：**

```typescript
import uaBrowser, { satisfies } from 'ua-browser'

const info = uaBrowser()

// 等同于 info.os === 'iOS' && info.device === 'Mobile'
if (satisfies(info, { os: 'iOS', device: 'Mobile' })) {
  // ...
}

// 仅匹配 AI 爬虫
if (satisfies(info, { isBot: true, botCategory: 'ai-llm' })) {
  // ...
}

// 仅匹配 App 内嵌浏览器（微信、钉钉等）
if (satisfies(info, { browserType: 'app' })) {
  // ...
}
```

---

---

## `VERSION` {#version}

当前库版本号字符串，与 `package.json` 中的 `version` 字段一致。

```typescript
import { VERSION } from 'ua-browser'

VERSION: string  // 例如 '2.0.0'
```