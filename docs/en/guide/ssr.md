---
title: Node.js / SSR
description: Use parseUA and parseHeaders in Node.js, Next.js, Nuxt, and other SSR frameworks for browser environment detection.
---

# Node.js / SSR

## UA-only parsing: `parseUA()`

A pure function with no browser API dependencies — runs in Node.js, Deno, and Edge Runtime:

```typescript
import { parseUA } from 'ua-browser'

const ua = req.headers['user-agent'] ?? ''
const { browser, os, device, isBot, botName } = parseUA(ua)

if (isBot) {
  res.status(403).end()
  return
}
```

**Limitation**: UA string freezing affects server-side detection too — Chrome version is fixed at `149.0.0.0`, macOS 26+ shows as `10.15.7`. Use `parseHeaders()` for real values.

---

## Accurate detection with Client Hints: `parseHeaders()`

Chrome / Edge 90+ sends `Sec-CH-UA-*` headers on HTTPS requests. Set the `Accept-CH` response header once, then use `parseHeaders()` on subsequent requests:

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// First response: tell the browser to start sending Client Hints
res.setHeader('Accept-CH', ACCEPT_CH)

// Subsequent requests carry Sec-CH-UA-* headers
const result = parseHeaders(req.headers)

console.log(result.version)   // '149.0.7827.102' — from Sec-CH-UA-Full-Version-List
console.log(result.arch)      // 'x86_64' — from Sec-CH-UA-Arch
console.log(result.osVersion) // '26.5.1' — from Sec-CH-UA-Platform-Version
```

**What `parseHeaders()` adds over `parseUA()`:**

| Capability | `parseUA()` | `parseHeaders()` |
| :-- | :-- | :-- |
| Real browser full version | Frozen UA value | ✅ `Sec-CH-UA-Full-Version-List` |
| macOS 26+ real version | Frozen UA value | ✅ `Sec-CH-UA-Platform-Version` |
| CPU architecture | UA inference | ✅ `Sec-CH-UA-Arch` |
| Brave browser detection | ❌ | ✅ `Sec-CH-UA` brand |
| Windows 10 / 11 distinction | ❌ | ✅ `Sec-CH-UA-Platform-Version` |

---

## Next.js example

```typescript
// pages/api/detect.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Accept-CH', ACCEPT_CH)
  const result = parseHeaders(req.headers as Record<string, string>)
  res.json(result)
}
```

---

## Accurate Windows 10 / 11 Detection

Windows 10 and 11 share the same UA string — use Client Hints to tell them apart:

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

// Browser-side only
const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const { os, osVersion } = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(osVersion) // '11' or '10'
```

> In SSR, Windows 10/11 distinction is handled automatically by `parseHeaders()` via `Sec-CH-UA-Platform-Version`.
