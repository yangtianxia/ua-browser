# ua-browser

[![npm version](https://img.shields.io/npm/v/ua-browser?color=cb3837)](https://www.npmjs.com/package/ua-browser)
[![npm downloads](https://img.shields.io/npm/dm/ua-browser)](https://www.npmjs.com/package/ua-browser)
[![license](https://img.shields.io/npm/l/ua-browser)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)

通过 User Agent 检测浏览器、操作系统、设备类型、渲染内核、CPU 架构、爬虫、无头浏览器及小程序运行环境。零依赖，支持浏览器与 Node.js 双环境。

**[📖 文档](https://yangtianxia.github.io/ua-browser/)** · **[🎮 Playground](https://yangtianxia.github.io/ua-browser/playground)** · **[English](./README.en.md)**

## 特性

- **全面 UA 检测** — 浏览器、OS、渲染内核、设备类型（Mobile / Tablet / TV / PC）、CPU 架构、爬虫、无头浏览器
- **多信号架构检测** — `getEnvContext()` 采集 Client Hints、WebGL 渲染器、字体探针，精确区分 Apple Silicon 与 Intel Mac
- **SSR Client Hints** — `parseHeaders()` + `ACCEPT_CH`，在 Chrome / Edge 90+ 中实现服务端精准检测（CPU 架构、平台等）
- **AI 爬虫识别** — 内置 GPTBot、ClaudeBot、PerplexityBot、CCBot 等主流 AI 抓取机器人
- **零依赖** — 无任何运行时依赖，gzip 后体积极小
- **纯函数** — `parseUA()` 无全局状态，天然支持 SSR / Node.js
- **TypeScript** — 完整类型定义，`BrowserName`、`OsName` 等均为精确字面量联合类型
- **Tree-shakeable** — 所有功能按需导入，不引入多余代码

## 安装

```sh
npm i ua-browser
# pnpm
pnpm add ua-browser
# yarn
yarn add ua-browser
```

## 快速上手

```typescript
import uaBrowser from 'ua-browser'

const info = uaBrowser()

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

> 传入自定义 UA 字符串：`uaBrowser('Mozilla/5.0 ...')`

## 使用

### 浏览器环境

```typescript
import uaBrowser from 'ua-browser'

const { browser, os, device } = uaBrowser()

if (device === 'Mobile') {
  // 跳转移动版
}
```

### Node.js / SSR

```typescript
import { parseUA } from 'ua-browser'

const ua = req.headers['user-agent'] ?? ''
const { browser, os, isBot } = parseUA(ua)

if (isBot) {
  // 拦截或放行爬虫
}
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const { browser, os } = uaBrowser()
</script>
```

### 多信号架构检测

`getEnvContext()` 一次性采集 Client Hints、WebGL 渲染器等多维信号，可区分 Apple Silicon 与 Intel Mac：

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.arch) // 'arm64' 或 'x86_64'
```

### SSR Client Hints

通过响应头告知 Chrome / Edge 90+ 上报 Client Hints，再用 `parseHeaders` 在服务端精准解析：

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// 第一次响应时写入 Accept-CH
res.setHeader('Accept-CH', ACCEPT_CH)

// 后续请求携带 Client Hints 后，精准识别架构等信息
const result = parseHeaders(req.headers)
console.log(result.arch) // 'x86_64'（来自 Sec-CH-UA-Arch）
```

### 精确区分 Windows 10 / 11

Windows 10 和 11 的 UA 字符串相同，需借助 Client Hints API 异步获取：

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '10' 或 '11'
```

## API

### 默认导出 `uaBrowser(ua?)`

在浏览器环境中自动注入 `navigator` 上下文（语言、平台、MIME 类型等）。

```typescript
uaBrowser()           // 自动读取 navigator.userAgent
uaBrowser(customUA)   // 传入自定义 UA，仍注入当前浏览器上下文
```

### 命名导出（按需引入）

```typescript
import {
  parseUA,              // 纯函数，适合 SSR / Node.js
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
  VERSION,              // 当前版本号
} from 'ua-browser'
```

### 返回值 `EnvOption`

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| `browser` | `BrowserName` | 浏览器名称 |
| `version` | `string` | 浏览器版本 |
| `engine` | `EngineName` | 渲染内核 |
| `os` | `OsName` | 操作系统 |
| `osVersion` | `string` | 系统版本 |
| `device` | `DeviceName` | 设备类型：`Mobile` \| `Tablet` \| `TV` \| `PC` |
| `arch` | `ArchName` | CPU 架构 |
| `isWebview` | `boolean` | 是否为 Android Webview / iOS WKWebView |
| `isHeadless` | `boolean` | 是否为无头 / 自动化浏览器 |
| `isBot` | `boolean` | 是否为爬虫 / 机器人 |
| `botName` | `BotName` | 爬虫名称 |
| `language` | `string` | 浏览器语言，如 `zh-CN` |
| `platform` | `string` | 平台标识，如 `Win32` |

> 所有字段在无法识别时统一返回 `'unknown'`，不返回空字符串或 `null`。

## 支持范围

内置超过 70 种浏览器、17 种操作系统、19 种爬虫规则，详见 **[内置支持列表](https://yangtianxia.github.io/ua-browser/guide/support-list)**。

部分覆盖：
- **浏览器** — Chrome、Safari、Firefox、Edge、Samsung Internet、UC、微信、钉钉、抖音、哔哩哔哩、快手、小红书、飞书等
- **操作系统** — Windows、macOS、Android、iOS、HarmonyOS、OpenHarmony、Tizen、KaiOS 等
- **AI 爬虫** — GPTBot、ClaudeBot、PerplexityBot、CCBot 等
- **设备** — Mobile、Tablet、TV（含三星 Smart TV、HbbTV 标准）、PC

## License

[MIT](./LICENSE) © yangtianxia
