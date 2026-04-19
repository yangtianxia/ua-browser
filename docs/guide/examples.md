# 使用示例

## 设备跳转

根据设备类型将用户重定向到对应版本：

```typescript
import uaBrowser from 'ua-browser'

const { device } = uaBrowser()

if (device === 'Mobile' || device === 'Tablet') {
  window.location.href = 'https://m.example.com'
}
```

---

## 拦截爬虫请求

服务端中间件中过滤爬虫流量：

```typescript
import { parseUA } from 'ua-browser'

// Express / Koa 中间件
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

## 拦截无头浏览器

防止自动化脚本访问：

```typescript
import uaBrowser from 'ua-browser'

const { isHeadless, isBot } = uaBrowser()

if (isHeadless || isBot) {
  document.body.innerHTML = 'Access denied.'
}
```

---

## 按浏览器加载兼容代码

针对特定浏览器加载 polyfill 或降级方案：

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

## 微信环境检测

判断是否在微信内置浏览器或小程序中运行：

```typescript
import uaBrowser, { isWechatMiniapp } from 'ua-browser'

const { browser } = uaBrowser()

if (isWechatMiniapp()) {
  // 微信小程序环境
  wx.navigateTo({ url: '/pages/index/index' })
} else if (browser === 'Wechat') {
  // 微信内置浏览器
  initWechatSDK()
}
```

---

## SSR / Node.js 中解析请求 UA

在服务端根据 UA 返回差异化内容：

```typescript
import { parseUA } from 'ua-browser'

// Next.js / Nuxt 等 SSR 框架
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

## 精确区分 Windows 10 / 11

Windows 10 和 11 的 UA 字符串相同，需要借助 `navigator.userAgentData` 异步获取：

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const { os, osVersion } = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(os)        // 'Windows'
console.log(osVersion) // '11' 或 '10'
```

---

## Vue 组合式函数封装

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

## React Hook 封装

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

## 按需使用独立检测器

只需要某个检测能力时，按需导入以减小打包体积：

```typescript
// 只检测架构，不引入其他代码
import { detectArch } from 'ua-browser'

const arch = detectArch(navigator.userAgent)
// 'x86_64' | 'arm64' | 'arm' | 'x86' | 'unknown'

if (arch === 'arm64') {
  console.log('Apple Silicon / ARM 设备')
}
```

---

## 统计上报

采集用户环境信息并上报：

```typescript
import uaBrowser from 'ua-browser'

const { browser, version, os, device, arch } = uaBrowser()

fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ browser, version, os, device, arch }),
})
```
