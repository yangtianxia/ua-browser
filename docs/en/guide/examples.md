# Examples

## Device Redirect

Redirect users to the appropriate version based on device type:

```typescript
import uaBrowser from 'ua-browser'

const { device } = uaBrowser()

if (device === 'Mobile' || device === 'Tablet') {
  window.location.href = 'https://m.example.com'
}
```

---

## Block Bot Requests

Filter crawler traffic in server-side middleware:

```typescript
import { parseUA } from 'ua-browser'

// Express / Koa middleware
function blockBots(req, res, next) {
  const ua = req.headers['user-agent'] ?? ''
  const { isBot, botName } = parseUA(ua)

  if (isBot) {
    console.log(`Bot blocked: ${botName}`)
    return res.status(403).end()
  }

  next()
}
```

---

## Block Headless Browsers

Prevent automated script access:

```typescript
import uaBrowser from 'ua-browser'

const { isHeadless, isBot } = uaBrowser()

if (isHeadless || isBot) {
  document.body.innerHTML = 'Access denied.'
}
```

---

## Load Browser-specific Polyfills

Load polyfills or fallbacks for specific browsers:

```typescript
import uaBrowser from 'ua-browser'

const { browser, version } = uaBrowser()

if (browser === 'IE') {
  await import('./polyfills/ie.js')
} else if (browser === 'Safari' && parseInt(version) < 14) {
  await import('./polyfills/safari-legacy.js')
}
```

---

## WeChat Environment Detection

Detect whether the app is running inside the WeChat browser or a Mini Program:

```typescript
import uaBrowser, { isWechatMiniapp } from 'ua-browser'

const { browser } = uaBrowser()

if (isWechatMiniapp()) {
  // WeChat Mini Program
  wx.navigateTo({ url: '/pages/index/index' })
} else if (browser === 'Wechat') {
  // WeChat in-app browser
  initWechatSDK()
}
```

---

## SSR / Node.js — Parse Request UA

Return differentiated content based on UA in server-side rendering:

```typescript
import { parseUA } from 'ua-browser'

// Next.js / Nuxt SSR
export async function getServerSideProps({ req }) {
  const ua = req.headers['user-agent'] ?? ''
  const { device, os, browser } = parseUA(ua)

  return {
    props: {
      isMobile: device === 'Mobile',
      isIOS: os === 'iOS',
      isWeChat: browser === 'Wechat',
    },
  }
}
```

---

## Accurate Windows 10 / 11 Detection

Windows 10 and 11 share the same UA string. Use `navigator.userAgentData` to distinguish them:

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

  onMounted(() => {
    info.value = uaBrowser()
  })

  return { info }
}
```

```vue
<script setup lang="ts">
import { useBrowser } from '@/composables/useBrowser'

const { info } = useBrowser()
</script>

<template>
  <div v-if="info">
    {{ info.browser }} {{ info.version }} on {{ info.os }}
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
    setInfo(uaBrowser())
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
    <p>{info.browser} {info.version} on {info.os}</p>
  )
}
```

---

## Use Standalone Detectors

Import only the detector you need to minimize bundle size:

```typescript
import { detectArch } from 'ua-browser'

const arch = detectArch(navigator.userAgent)
// 'x86_64' | 'arm64' | 'arm' | 'x86' | 'unknown'

if (arch === 'arm64') {
  console.log('Apple Silicon / ARM device')
}
```

---

## Analytics Reporting

Collect and report user environment data:

```typescript
import uaBrowser from 'ua-browser'

const { browser, version, os, device, arch } = uaBrowser()

fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ browser, version, os, device, arch }),
})
```
