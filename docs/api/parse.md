---
title: Parse Functions — parseUA() and parseHeaders()
description: Parse a User-Agent string or Sec-CH-UA headers where there is no navigator — Node.js, SSR, and log analysis. Covers parseUA(), parseHeaders(), ACCEPT_CH.
---

# Parse Functions


---

## `parseUA(ua, options?)` {#parseua}

The pure-function version: no global state, no DOM access. Ideal for SSR, Node.js, and unit tests.

```typescript
import { parseUA } from 'ua-browser'

parseUA(ua: string, options?: ParseOptions): EnvOption
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `ua` | `string` | Yes | UA string to parse |
| `options` | [`ParseOptions`](/api/types#parseoptions) | No | Inject context; see the table below |

**`ParseOptions` fields:**

| Field | Type | Description |
| :-- | :-- | :-- |
| `nav` | [`NavContext`](/api/types#navcontext) | Browser environment subset (language, platform, touch points). Use `getNavContext()` to read it from `navigator`. |
| `windowsVersion` | `string \| null` | Windows version pre-fetched by `getWindowsVersion()`, used to tell Windows 10 from 11. |
| `ctx` | [`EnvContext`](/api/types#envcontext) | Return value of `getEnvContext()`, carrying the full multi-signal context. **Takes priority over `nav` and `windowsVersion` when both are passed**. |
| `customBotDefs` | `readonly BotDef[]` | Custom bot rules, inserted before the `GenericBot` fallback. Does not affect global state. |
| `language` | `string` | Explicit language override (BCP47, e.g. `"zh-CN"`). Takes priority over nav/ctx and UA inference — handy for passing an `Accept-Language` request header server-side. |

**Returns:** [`EnvOption`](/api/types#envoption)

**Example:**

```typescript
// Minimal usage: UA string only
const result = parseUA(navigator.userAgent)

// Inject the navigator context (language/platform filled in)
import { parseUA, getNavContext } from 'ua-browser'
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })
console.log(result.language) // 'zh-CN'
console.log(result.platform) // 'Win32'

// Inject the full environment context (enables multi-signal detection)
import { parseUA, getEnvContext } from 'ua-browser'
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })
console.log(result.arch) // 'arm64' (from WebGL / Client Hints)

// Custom bot rules
import { parseUA } from 'ua-browser'
import type { BotDef } from 'ua-browser'
const myBots: BotDef[] = [{ name: 'GenericBot', detect: /MyInternalCrawler/ }]
const result = parseUA(ua, { customBotDefs: myBots })
```

---

---

## `parseHeaders(headers)` {#parseheaders}

Parses UA and Client Hints from HTTP request headers and returns [`EnvOption`](/api/types#envoption). Built for precise server-side (SSR) detection.

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

parseHeaders(headers: Record<string, string | string[] | undefined>): EnvOption
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `headers` | `Record<string, string \| string[] \| undefined>` | Yes | HTTP request headers object (such as `req.headers` in Express / Next.js) |

**Returns:** [`EnvOption`](/api/types#envoption)

**Client Hints request headers it reads:**

| Header | Data |
| :-- | :-- |
| `user-agent` | Full UA string |
| `sec-ch-ua` | Browser brand list |
| `sec-ch-ua-full-version-list` | Exact browser version |
| `sec-ch-ua-platform` | Operating system name |
| `sec-ch-ua-platform-version` | OS version (tells Windows 10 from 11) |
| `sec-ch-ua-arch` | CPU architecture (e.g. `x86`, `arm`) |
| `sec-ch-ua-mobile` | Mobile flag |

**Two-stage request flow:**

On the first request the browser sends only `user-agent`. Return `ACCEPT_CH` in the response and a supporting browser will attach Client Hints to subsequent requests.

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// First response — ask the browser to report Client Hints
res.setHeader('Accept-CH', ACCEPT_CH)

// Later requests, once Client Hints are attached
const result = parseHeaders(req.headers)
console.log(result.arch) // 'x86_64' (from Sec-CH-UA-Arch)
console.log(result.os)   // 'Windows'
```

**Notes:**
- Works with any framework that exposes request headers as a plain object — Express, Koa, Next.js API routes, Fastify, Hono, and others.
- Falls back to UA-only parsing when the Client Hints headers are missing.

---

---

## `ACCEPT_CH` {#accept-ch}

A constant string listing every Client Hints request header name that `parseHeaders()` consumes. Set it as the `Accept-CH` response header to ask supporting browsers (Chrome / Edge 90+) to include this information in subsequent requests.

```typescript
import { ACCEPT_CH } from 'ua-browser'

ACCEPT_CH: string
// 'Sec-CH-UA, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Mobile'
```

**Example:**

```typescript
res.setHeader('Accept-CH', ACCEPT_CH)
res.setHeader('Vary', 'Sec-CH-UA, Sec-CH-UA-Full-Version-List')  // recommended alongside
```

---
