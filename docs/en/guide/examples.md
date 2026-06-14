---
title: Examples
description: Real-world ua-browser examples — device detection, AI bot recognition, SSR detection, headless browser blocking, Windows 10/11 detection.
---

# Examples

## Device Redirect

### Accurate redirect (recommended)

The synchronous `uaBrowser()` call cannot detect phones in desktop mode. Use `detect()` to identify the real device via hardware signals (CSS safe-area, device pixel ratio, etc.):

```typescript
import uaBrowser from 'ua-browser'

// detect() correctly identifies mobile even when the user has enabled desktop mode
const result = await uaBrowser.detect()

if (result.device === 'Mobile' || result.device === 'Tablet') {
  window.location.href = 'https://m.example.com'
}
```

### Quick redirect (when accuracy is not critical)

```typescript
import uaBrowser from 'ua-browser'

// Sync, no waiting — but a phone in desktop mode is detected as 'PC'
const { device } = uaBrowser()

if (device === 'Mobile' || device === 'Tablet') {
  window.location.href = 'https://m.example.com'
}
```

---

## Getting the Real Browser Version

Chrome 109+ freezes the UA minor version to `0.0.0` (e.g. `149.0.0.0`). Use `detect()` when you need the real version:

```typescript
import uaBrowser from 'ua-browser'

// ❌ Sync: version = '149.0.0.0' (frozen UA value)
const sync = uaBrowser()
console.log(sync.version) // '149.0.0.0'

// ✅ Async: version = '149.0.7827.102' (real value from Client Hints)
const result = await uaBrowser.detect()
console.log(result.version)      // '149.0.7827.102'
console.log(result.versionMajor) // 149

// Load polyfills based on actual version
if (result.browser === 'Safari' && result.versionMajor < 16) {
  await import('./polyfills/safari-legacy.js')
}
```

> **Note**: `detect()` requires HTTPS or localhost. On plain HTTP it falls back to frozen UA values.

---

## AI Crawler Recognition

40+ built-in bot rules let you filter crawlers precisely in server middleware:

```typescript
import { parseUA } from 'ua-browser'

// Express / Koa middleware
function handleBots(req, res, next) {
  const ua = req.headers['user-agent'] ?? ''
  const { isBot, botName, botCategory } = parseUA(ua)

  if (!isBot) return next()

  // AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
  if (botCategory === 'ai-llm') {
    return res.status(200).json({ allowed: false, reason: 'ai-crawler' })
  }

  // Allow search engine crawlers through
  if (botCategory === 'search-engine') {
    return next()
  }

  console.log(`Bot blocked: ${botName} (${botCategory})`)
  return res.status(403).end()
}
```

---

## Block Headless Browsers

Playwright and Puppeteer's default UAs are identical to real Chrome — use `isHeadless` to detect them:

```typescript
import uaBrowser from 'ua-browser'

const { isHeadless, isBot } = uaBrowser()

if (isHeadless) {
  // Automated script / scraper
  document.body.innerHTML = 'Access denied.'
}
```

---

## SSR: Server-side Differential Rendering

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

## SSR: Accurate Detection with Client Hints

Combine `Sec-CH-UA-*` headers in Express / Next.js to get real version, arch, and OS version:

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// First response: tell the browser to start sending Client Hints
app.use((_req, res, next) => {
  res.setHeader('Accept-CH', ACCEPT_CH)
  next()
})

// Subsequent requests: get real version and architecture
app.get('/api/info', (req, res) => {
  const result = parseHeaders(req.headers)
  res.json({
    browser:   result.browser,
    version:   result.version,   // '149.0.7827.102' (not the frozen UA value)
    os:        result.os,
    osVersion: result.osVersion, // '26.5.1' (real macOS version)
    arch:      result.arch,      // 'x86_64' (from Sec-CH-UA-Arch)
  })
})
```

---

## Accurate Windows 10 / 11 Detection

Windows 10 and 11 share the same UA string — use `navigator.userAgentData` to tell them apart:

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const { os, osVersion } = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(os)        // 'Windows'
console.log(osVersion) // '11' or '10'
```

---

## Vue Composable

```typescript
// composables/useBrowser.ts
import { ref, onMounted } from 'vue'
import uaBrowser from 'ua-browser'
import type { EnvOption } from 'ua-browser'

export function useBrowser() {
  const info = ref<EnvOption | null>(null)
  const loading = ref(true)

  onMounted(async () => {
    // detect() for accurate version, device, and arch
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
    // detect() collects hardware signals asynchronously
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

## Analytics Reporting

Report real version and arch, not frozen UA values:

```typescript
import uaBrowser from 'ua-browser'

// detect() for accurate data
const { browser, version, versionMajor, os, osVersion, device, arch } =
  await uaBrowser.detect()

fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ browser, version, versionMajor, os, osVersion, device, arch }),
})
```

---

## Tree-shakeable Individual Detectors

Import only the detection you need to keep your bundle lean:

```typescript
import { detectBot, detectArch } from 'ua-browser'

const ua = navigator.userAgent

// Bot detection only
const { isBot, botName, botCategory } = detectBot(ua)

// Arch detection only (UA-based, no Client Hints)
const arch = detectArch(ua)
// 'x86_64' | 'arm64' | 'arm' | 'x86' | 'unknown'
```
