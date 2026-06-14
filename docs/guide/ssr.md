---
title: Node.js / SSR
description: 在 Node.js、Next.js、Nuxt 等 SSR 框架中使用 parseUA 和 parseHeaders 检测浏览器环境。
---

# Node.js / SSR

## 纯 UA 解析：`parseUA()`

纯函数，无浏览器 API 依赖，可直接在 Node.js、Deno、Edge Runtime 使用：

```typescript
import { parseUA } from 'ua-browser'

const ua = req.headers['user-agent'] ?? ''
const { browser, os, device, isBot, botName } = parseUA(ua)

if (isBot) {
  // 拦截爬虫
  res.status(403).end()
  return
}

if (device === 'Mobile') {
  // 服务端判断设备类型
}
```

**局限性**：UA 字符串的冻结问题同样存在于服务端——Chrome 版本固定为 `149.0.0.0`，macOS 26+ 显示为 `10.15.7`。需要真实值时使用 `parseHeaders()`。

---

## Client Hints 精准检测：`parseHeaders()`

Chrome / Edge 90+ 在 HTTPS 环境下会随请求发送 `Sec-CH-UA-*` 头。通过先发送 `Accept-CH` 响应头，再用 `parseHeaders()` 解析后续请求，可获得真实版本和架构信息。

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// 第一次响应：告知浏览器开始上报 Client Hints
res.setHeader('Accept-CH', ACCEPT_CH)

// 后续请求携带 Sec-CH-UA-* 头后，精确解析
const result = parseHeaders(req.headers)

console.log(result.version)   // '149.0.7827.102' — 来自 Sec-CH-UA-Full-Version-List
console.log(result.arch)      // 'x86_64' — 来自 Sec-CH-UA-Arch
console.log(result.osVersion) // '26.5.1' — 来自 Sec-CH-UA-Platform-Version
```

**相比 `parseUA()` 的额外能力：**

| 能力 | `parseUA()` | `parseHeaders()` |
| :-- | :-- | :-- |
| 浏览器完整版本 | UA 冻结值 | ✅ `Sec-CH-UA-Full-Version-List` |
| macOS 26+ 真实版本 | UA 冻结值 | ✅ `Sec-CH-UA-Platform-Version` |
| CPU 架构 | UA 推断 | ✅ `Sec-CH-UA-Arch` |
| Brave 浏览器识别 | ❌ | ✅ `Sec-CH-UA` 品牌 |
| Windows 10 / 11 区分 | ❌ | ✅ `Sec-CH-UA-Platform-Version` |

---

## Next.js 示例

```typescript
// pages/api/detect.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 通知浏览器上报 Client Hints
  res.setHeader('Accept-CH', ACCEPT_CH)

  const result = parseHeaders(req.headers as Record<string, string>)
  res.json(result)
}
```

---

## 精确区分 Windows 10 / 11

Windows 10 和 11 的 UA 字符串完全相同，需借助 Client Hints API：

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

// 仅限浏览器端
const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const { os, osVersion } = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(osVersion) // '11' 或 '10'
```

> 在 SSR 环境中，Windows 10/11 区分通过 `parseHeaders()` 读取 `Sec-CH-UA-Platform-Version` 自动完成，无需额外调用。
