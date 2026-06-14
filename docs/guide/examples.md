---
title: 使用示例
description: ua-browser 常见使用场景：设备类型检测、AI 爬虫识别、SSR 服务端检测、无头浏览器拦截、Windows 10/11 区分。
---

# 使用示例

## 设备跳转

### 精准跳转（推荐）

`uaBrowser()` 同步调用无法识别开了桌面模式的手机。使用 `detect()` 可通过硬件信号（CSS safe-area、设备像素比等）识别真实设备：

```typescript
import uaBrowser from 'ua-browser'

// detect() 即使手机开了"请求桌面网站"也能正确识别为 Mobile
const result = await uaBrowser.detect()

if (result.device === 'Mobile' || result.device === 'Tablet') {
  window.location.href = 'https://m.example.com'
}
```

### 快速跳转（不需要精确设备检测时）

```typescript
import uaBrowser from 'ua-browser'

// 同步，无需等待；但开了桌面模式的手机会被识别为 PC
const { device } = uaBrowser()

if (device === 'Mobile' || device === 'Tablet') {
  window.location.href = 'https://m.example.com'
}
```

---

## 获取真实浏览器版本

Chrome 109+ 将 UA 中的小版本冻结为 `0.0.0`（如 `149.0.0.0`）。需要真实版本时必须用 `detect()`：

```typescript
import uaBrowser from 'ua-browser'

// ❌ 同步：version = '149.0.0.0'（UA 冻结值）
const sync = uaBrowser()
console.log(sync.version) // '149.0.0.0'

// ✅ 异步：version = '149.0.7827.102'（Client Hints 真实值）
const result = await uaBrowser.detect()
console.log(result.version)      // '149.0.7827.102'
console.log(result.versionMajor) // 149

// 按版本加载兼容代码
if (result.browser === 'Safari' && result.versionMajor < 16) {
  await import('./polyfills/safari-legacy.js')
}
```

> **注意**：`detect()` 需要 HTTPS 或 localhost 环境，HTTP 下退回 UA 冻结值。

---

## 识别 AI 爬虫

库内置 40+ 爬虫规则，可在服务端中间件中精准过滤：

```typescript
import { parseUA } from 'ua-browser'

// Express / Koa 中间件
function handleBots(req, res, next) {
  const ua = req.headers['user-agent'] ?? ''
  const { isBot, botName, botCategory } = parseUA(ua)

  if (!isBot) return next()

  // AI 爬虫（GPTBot、ClaudeBot、PerplexityBot 等）
  if (botCategory === 'ai-llm') {
    return res.status(200).json({ allowed: false, reason: 'ai-crawler' })
  }

  // 搜索引擎爬虫放行
  if (botCategory === 'search-engine') {
    return next()
  }

  console.log(`Bot blocked: ${botName} (${botCategory})`)
  return res.status(403).end()
}
```

---

## 拦截无头浏览器

Playwright / Puppeteer 的默认 UA 与正常 Chrome 一致，需靠 `isHeadless` 标记识别：

```typescript
import uaBrowser from 'ua-browser'

const { isHeadless, isBot } = uaBrowser()

if (isHeadless) {
  // 自动化脚本 / 爬虫
  document.body.innerHTML = 'Access denied.'
}
```

---

## SSR：服务端差异化渲染

```typescript
import { parseUA } from 'ua-browser'

// Next.js getServerSideProps
export async function getServerSideProps({ req }) {
  const ua = req.headers['user-agent'] ?? ''
  const { device, os, browser } = parseUA(ua)

  return {
    props: {
      isMobile: device === 'Mobile',
      isIOS:    os === 'iOS',
      isWeChat: browser === 'Wechat',
    },
  }
}
```

---

## SSR：Client Hints 精准检测

在 Express / Next.js 中结合 `Sec-CH-UA-*` 头，获取真实版本、架构和 OS 版本：

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// 第一次响应：通知浏览器上报 Client Hints
app.use((_req, res, next) => {
  res.setHeader('Accept-CH', ACCEPT_CH)
  next()
})

// 后续请求：获取真实版本和架构
app.get('/api/info', (req, res) => {
  const result = parseHeaders(req.headers)
  res.json({
    browser:   result.browser,
    version:   result.version,   // '149.0.7827.102'（非 UA 冻结值）
    os:        result.os,
    osVersion: result.osVersion, // '26.5.1'（macOS 真实版本）
    arch:      result.arch,      // 'x86_64'（来自 Sec-CH-UA-Arch）
  })
})
```

---

## 精确区分 Windows 10 / 11

Windows 10 和 11 的 UA 字符串完全相同，需借助 `navigator.userAgentData` 区分：

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const { os, osVersion } = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(os)        // 'Windows'
console.log(osVersion) // '11' 或 '10'
```

---

## Vue 组合式函数

```typescript
// composables/useBrowser.ts
import { ref, onMounted } from 'vue'
import uaBrowser from 'ua-browser'
import type { EnvOption } from 'ua-browser'

export function useBrowser() {
  const info = ref<EnvOption | null>(null)
  const loading = ref(true)

  onMounted(async () => {
    // detect() 获取精准版本、设备、架构
    info.value = await uaBrowser.detect()
    loading.value = false
  })

  return { info, loading }
}
```

```vue
<script setup lang="ts">
import { useBrowser } from '@/composables/useBrowser'

const { info, loading } = useBrowser()
</script>

<template>
  <div v-if="!loading && info">
    {{ info.browser }} {{ info.version }} · {{ info.os }} {{ info.osVersion }}
    <span v-if="info.arch !== 'unknown'">({{ info.arch }})</span>
  </div>
</template>
```

---

## React Hook

```typescript
// hooks/useBrowser.ts
import { useState, useEffect } from 'react'
import uaBrowser from 'ua-browser'
import type { EnvOption } from 'ua-browser'

export function useBrowser(): EnvOption | null {
  const [info, setInfo] = useState<EnvOption | null>(null)

  useEffect(() => {
    // detect() 异步采集硬件信号，获取精准结果
    uaBrowser.detect().then(setInfo)
  }, [])

  return info
}
```

```tsx
import { useBrowser } from '@/hooks/useBrowser'

export function BrowserInfo() {
  const info = useBrowser()
  if (!info) return null

  return (
    <p>
      {info.browser} {info.version} · {info.os} {info.osVersion}
      {info.arch !== 'unknown' && ` (${info.arch})`}
    </p>
  )
}
```

---

## 统计上报

上报真实版本和架构，而非 UA 冻结值：

```typescript
import uaBrowser from 'ua-browser'

// detect() 获取真实数据
const { browser, version, versionMajor, os, osVersion, device, arch } =
  await uaBrowser.detect()

fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ browser, version, versionMajor, os, osVersion, device, arch }),
})
```

---

## 按需使用独立检测器

只需要单项检测能力时，按需导入减小打包体积：

```typescript
import { detectBot, detectArch } from 'ua-browser'

const ua = navigator.userAgent

// 只检测爬虫
const { isBot, botName, botCategory } = detectBot(ua)

// 只检测架构（UA 层，不含 Client Hints）
const arch = detectArch(ua)
// 'x86_64' | 'arm64' | 'arm' | 'x86' | 'unknown'
```
