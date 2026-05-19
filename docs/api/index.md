# API 参考

## 默认导出

### `uaBrowser(ua?)`

解析 UA 并返回完整的环境信息对象。在浏览器中自动注入 `navigator` 上下文。

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(ua?: string): EnvOption
```

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| `ua` | `string` | 可选。UA 字符串，省略时自动读取 `navigator.userAgent` |

**返回值：** [`EnvOption`](/api/types#envoption)

默认导出对象同时挂载了以下静态方法：

```typescript
uaBrowser.isWebview(ua: string): boolean
uaBrowser.getLanguage(): string
uaBrowser.VERSION: string
uaBrowser.detect(ua?: string): Promise<EnvOption>
```

`uaBrowser.detect()` 是 `uaBrowser()` 的异步高精度版本，内部先调用 `getEnvContext()` 采集多信号上下文，再执行解析，返回的 `confidence` 通常为 `'high'` 或 `'medium'`。

---

## 命名导出

### `parseUA(ua, options?)`

纯函数版本，适合 SSR / Node.js 环境，无任何全局副作用。

```typescript
import { parseUA } from 'ua-browser'

parseUA(ua: string, options?: ParseOptions): EnvOption
```

```typescript
interface ParseOptions {
  nav?:            NavContext          // 注入浏览器环境上下文（语言、平台等）
  windowsVersion?: string | null      // 预先获取的 Windows 版本
  ctx?:            EnvContext         // 多信号上下文，由 getEnvContext() 返回；优先级高于 nav 和 windowsVersion
  customBotDefs?:  readonly BotDef[]  // 自定义 Bot 规则，插在 GenericBot 兜底之前
}
```

---

### `isWebview(ua)`

检测 UA 中是否包含 Android Webview 标识（`; wv`）或 iOS WKWebView 特征（无 `Version/` 且无 `Safari/`）。

```typescript
isWebview(ua: string): boolean
```

---

### `getEnvContext()`

一次性采集当前浏览器的所有环境信号（Client Hints、WebGL 渲染器、字体探针、媒体特性等），返回 `EnvContext` 对象。

```typescript
import { getEnvContext } from 'ua-browser'

getEnvContext(): Promise<EnvContext>
```

采集到的信号用于提升架构检测精度（如区分 Apple Silicon 与 Intel Mac），以及提供更完整的运行时上下文。

```typescript
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.arch)     // 'arm64'（基于 WebGL / Client Hints）
console.log(result.language) // 'zh-CN'
console.log(result.platform) // 'MacIntel'
```

> `getEnvContext()` 内所有 DOM API 均包裹在 `try/catch` 中，不会抛出异常。

---

### `parseHeaders(headers)`

从 HTTP 请求头中解析 UA 及 Client Hints 信息，返回 `EnvOption`。适用于 SSR 精准检测场景。

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

parseHeaders(headers: Record<string, string | string[] | undefined>): EnvOption
```

在响应头中返回 `ACCEPT_CH`，告知支持的浏览器（Chrome / Edge 90+）在后续请求中携带 Client Hints：

```typescript
// Express / Koa / Next.js API Route
res.setHeader('Accept-CH', ACCEPT_CH)

// 后续请求携带 Client Hints 后，parseHeaders 可精确识别架构等信息
const result = parseHeaders(req.headers)
console.log(result.arch) // 'x86_64'（从 Sec-CH-UA-Arch 读取）
```

---

### `getWindowsVersion(nav)`

异步获取精确的 Windows 版本（用于区分 Windows 10 / 11）。

```typescript
getWindowsVersion(nav: NavContext): Promise<string | null>
```

需在调用 `parseUA` 前 `await`，然后作为 `windowsVersion` 选项传入。

> 依赖 `navigator.userAgentData`（Client Hints API），仅限支持该 API 的现代浏览器（Chrome 90+）；Node.js 或不支持时返回 `null`。

---

### `detectBot(ua, customDefs?)`

独立爬虫检测器。

```typescript
detectBot(ua: string, customDefs?: readonly BotDef[]): { isBot: boolean; botName: BotName }
```

`customDefs` 追加在内置规则之后、`GenericBot` 兜底之前，不影响全局状态：

```typescript
import { detectBot, parseUA } from 'ua-browser'
import type { BotDef } from 'ua-browser'

const myDefs: BotDef[] = [
  { name: 'GenericBot', detect: /MyInternalBot/ }
]

// 独立调用
detectBot(ua, myDefs)

// 通过 parseUA 透传
parseUA(ua, { customBotDefs: myDefs })
```

---

### `detectArch(ua, ctx?)`

独立 CPU 架构检测器，支持传入 `EnvContext` 以启用多信号检测。

```typescript
detectArch(ua: string, ctx?: EnvContext): ArchName
```

---

### `detectHeadless(ua)`

独立无头浏览器检测器。

```typescript
detectHeadless(ua: string): boolean
```

---

### `getNavContext()`

读取当前浏览器的 `navigator` 并返回 [`NavContext`](/api/types#navcontext) 对象，在 Node.js 中返回空的安全对象。

```typescript
import { getNavContext } from 'ua-browser'

getNavContext(): NavContext
```

通常与 `parseUA` 配合使用，将浏览器环境注入纯函数：

```typescript
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })

console.log(result.language) // 'zh-CN'
console.log(result.platform) // 'Win32'
```

---

### `getLanguage(nav)`

从 [`NavContext`](/api/types#navcontext) 中提取标准化的浏览器语言，如 `'zh-CN'`、`'en-US'`。

```typescript
import { getLanguage, getNavContext } from 'ua-browser'

getLanguage(nav: NavContext): string
```

---

### `VERSION`

当前库版本号，与 `package.json` 中的 `version` 字段一致。

```typescript
VERSION: string
```
