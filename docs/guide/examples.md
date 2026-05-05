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

## 小程序运行时检测

这些函数通过检测平台注入的全局变量，判断**当前 JS 是否运行在对应小程序的 Webview 中**。在普通浏览器里始终返回 `false`，适合跨环境共用的业务代码：

```typescript
import uaBrowser, {
  isWechatMiniapp,
  isAlipayMiniapp,
  isBaiduMiniapp,
  isDouyinMiniapp,
  isQQMiniapp,
  isKuaishouMiniapp,
} from 'ua-browser'

const { browser } = uaBrowser()

if (isWechatMiniapp()) {
  // 当前在微信小程序 Webview 中
  wx.navigateTo({ url: '/pages/index/index' })
} else if (browser === 'Wechat') {
  // 当前在微信内置浏览器（非小程序）
  initWechatSDK()
} else if (isAlipayMiniapp()) {
  // 当前在支付宝小程序 Webview 中
  my.navigateTo({ url: '/pages/index/index' })
} else if (isBaiduMiniapp()) {
  // 当前在百度智能小程序 Webview 中
  swan.navigateTo({ url: '/pages/index/index' })
} else if (isDouyinMiniapp()) {
  // 当前在抖音小程序 Webview 中
  tt.navigateTo({ url: '/pages/index/index' })
} else if (isQQMiniapp()) {
  // 当前在 QQ 小程序 Webview 中
  qq.navigateTo({ url: '/pages/index/index' })
} else if (isKuaishouMiniapp()) {
  // 当前在快手小程序 Webview 中
  ks.navigateTo({ url: '/pages/index/index' })
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

## 高精度架构检测（getEnvContext）

通过采集 WebGL 渲染器、Client Hints 等多维信号，区分 Apple Silicon 与 Intel Mac：

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.arch) // 'arm64'（Apple Silicon）或 'x86_64'
```

---

## SSR 精准检测（parseHeaders + Client Hints）

在 Express / Next.js 等服务端框架中，利用 HTTP Client Hints 实现精准检测：

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// 第一次响应：通知浏览器上报 Client Hints
app.use((req, res, next) => {
  res.setHeader('Accept-CH', ACCEPT_CH)
  next()
})

// 后续请求：精准解析架构、OS 等信息
app.get('/api/info', (req, res) => {
  const result = parseHeaders(req.headers)
  res.json({
    browser: result.browser,
    os:      result.os,
    arch:    result.arch, // 'x86_64'（来自 Sec-CH-UA-Arch）
  })
})
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
