# 快速开始

## 安装

::: code-group

```sh [npm]
npm i ua-browser
```

```sh [pnpm]
pnpm add ua-browser
```

```sh [yarn]
yarn add ua-browser
```

:::

## 基本用法

```typescript
import uaBrowser from 'ua-browser'

// 自动读取当前浏览器 UA
const info = uaBrowser()

// 或传入自定义 UA 字符串
const info = uaBrowser('Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...')

console.log(info)
// {
//   browser:    'Chrome',
//   version:    '124.0.0.0',
//   engine:     'Blink',
//   os:         'Windows',
//   osVersion:  '10',
//   device:     'PC',
//   arch:       'x86_64',
//   isWebview:  false,
//   isHeadless: false,
//   isBot:      false,
//   botName:    'unknown',
//   language:   'zh-CN',
//   platform:   'Win32'
// }
```

## 命名导出（Tree-shakeable）

按需引入单个功能，Vite / Rollup / webpack 5+ 会自动移除未使用的代码：

```typescript
import {
  parseUA,              // 纯函数版本，适合 SSR / Node.js
  getNavContext,        // 读取当前浏览器 navigator 上下文
  getWindowsVersion,    // 异步精确区分 Windows 10 / 11
  getLanguage,          // 从 NavContext 获取浏览器语言
  getEnvContext,        // 采集所有浏览器环境信号（Client Hints、WebGL 等）
  parseHeaders,         // 从 HTTP 请求头解析 UA 及 Client Hints（SSR）
  ACCEPT_CH,            // 响应头常量，告知浏览器上报 Client Hints
  isWebview,            // 检测 Android Webview / iOS WKWebView
  detectBot,            // 独立爬虫检测
  detectArch,           // 独立 CPU 架构检测
  detectHeadless,       // 独立无头浏览器检测
  VERSION               // 当前版本号
} from 'ua-browser'
```

## Node.js / SSR 用法

在服务端使用 `parseUA` 纯函数，传入 UA 字符串：

```typescript
import { parseUA } from 'ua-browser'

// 解析来自请求头的 UA
const ua = req.headers['user-agent'] ?? ''
const result = parseUA(ua)

console.log(result.browser) // 'Chrome'
console.log(result.os)      // 'Windows'
```

### 精确 Windows 11 检测

Windows 11 与 Windows 10 的 UA 字符串相同，需借助 `navigator.userAgentData` 异步获取。**仅限浏览器环境**，Node.js 下返回 `null`：

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '11' 或 '10'
```

## 高精度架构检测（getEnvContext）

`getEnvContext()` 一次性采集 Client Hints、WebGL 渲染器、字体探针等多维信号，可区分 Apple Silicon 与 Intel Mac：

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.arch)     // 'arm64'（Apple Silicon）或 'x86_64'
console.log(result.language) // 'zh-CN'
```

## SSR Client Hints（parseHeaders）

服务端通过返回 `ACCEPT_CH` 响应头，告知支持的浏览器（Chrome / Edge 90+）上报 Client Hints；后续请求中再用 `parseHeaders` 精准解析：

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// 第一次响应时写入 Accept-CH
res.setHeader('Accept-CH', ACCEPT_CH)

// 后续请求携带 Client Hints 后
const result = parseHeaders(req.headers)
console.log(result.arch)    // 'x86_64'（来自 Sec-CH-UA-Arch）
console.log(result.os)      // 'Windows'
```

## 浏览器（CDN）用法

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const info = uaBrowser()
  console.log(info.browser) // 'Chrome'
</script>
```

## 独立检测器

```typescript
import { detectBot, detectArch, detectHeadless } from 'ua-browser'

const ua = navigator.userAgent

// 爬虫检测
const { isBot, botName } = detectBot(ua)
// isBot: true, botName: 'Googlebot'

// CPU 架构检测
const arch = detectArch(ua)
// 'x86_64' | 'arm64' | 'arm' | 'x86' | 'unknown'

// 无头浏览器检测
const isHeadless = detectHeadless(ua)
// true | false
```
