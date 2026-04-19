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

按需引入单个功能，减小打包体积：

```typescript
import {
  parseUA,          // 纯函数版本，适合 SSR / Node.js
  isWebview,        // 检测 Android Webview
  isWechatMiniapp,  // 检测微信小程序
  getLanguage,      // 获取浏览器语言
  getWindowsVersion,// 异步获取精确 Windows 版本
  detectBot,        // 爬虫检测
  detectArch,       // CPU 架构检测
  detectHeadless,   // 无头浏览器检测
  VERSION           // 当前版本号
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

Windows 11 与 Windows 10 的 UA 字符串相同，需借助 `navigator.userAgentData` 异步获取：

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '11' 或 '10'
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
