---
title: 解析函数
description: parseUA()、parseHeaders() 和 ACCEPT_CH 的 API 文档，用于解析 UA 字符串和 HTTP 请求头。
---

# 解析函数


---

## `parseUA(ua, options?)` {#parseua}

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
| `language` | `string` | 显式语言覆盖（BCP47，如 `"zh-CN"`）。优先级高于 nav/ctx 及 UA 推断，适合服务端传入 `Accept-Language` 请求头。 |

**返回值：** [`EnvOption`](/api/types#envoption)

**示例：**

```typescript
// 最简用法：仅 UA 字符串
const result = parseUA(navigator.userAgent)

// 注入 navigator 上下文（language/platform 已填充）
import { parseUA, getNavContext } from 'ua-browser'
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })
console.log(result.language) // 'zh-CN'
console.log(result.platform) // 'Win32'

// 注入完整环境上下文（启用多信号检测）
import { parseUA, getEnvContext } from 'ua-browser'
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })
console.log(result.arch) // 'arm64'（基于 WebGL / Client Hints）

// 自定义 Bot 规则
import { parseUA } from 'ua-browser'
import type { BotDef } from 'ua-browser'
const myBots: BotDef[] = [{ name: 'GenericBot', detect: /MyInternalCrawler/ }]
const result = parseUA(ua, { customBotDefs: myBots })
```

---

---

## `parseHeaders(headers)` {#parseheaders}

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
| `sec-ch-ua-full-version-list` | 精确浏览器版本 |
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
console.log(result.arch) // 'x86_64'（来自 Sec-CH-UA-Arch）
console.log(result.os)   // 'Windows'
```

**注意事项：**
- 兼容 Express、Koa、Next.js API Route、Fastify、Hono 等任何以普通对象形式暴露请求头的框架。
- Client Hints 请求头缺失时回退到纯 UA 解析。

---

---

## `ACCEPT_CH` {#accept-ch}

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