# ua-browser

[![npm version](https://img.shields.io/npm/v/ua-browser?color=cb3837)](https://www.npmjs.com/package/ua-browser)
[![npm downloads](https://img.shields.io/npm/dm/ua-browser)](https://www.npmjs.com/package/ua-browser)
[![license](https://img.shields.io/npm/l/ua-browser)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)

通过 User Agent 检测浏览器、操作系统、设备类型、渲染内核、CPU 架构、爬虫、无头浏览器及小程序运行环境。零依赖，支持浏览器与 Node.js 双环境。

**[📖 文档](https://yangtianxia.github.io/ua-browser/)** · **[🎮 Playground](https://yangtianxia.github.io/ua-browser/playground)** · **[English](./README.en.md)**

## 特性

- **全面 UA 检测** — 浏览器（含 Arc / Brave）、OS（含 visionOS / tvOS）、渲染内核、设备类型（Mobile / Tablet / TV / PC / Console / XR）、CPU 架构、爬虫、无头浏览器
- **多信号架构检测** — `getEnvContext()` 采集 Client Hints、WebGL 渲染器、字体探针，精确区分 Apple Silicon 与 Intel Mac
- **SSR Client Hints** — `parseHeaders()` + `ACCEPT_CH`，在 Chrome / Edge 90+ 中实现服务端精准检测（CPU 架构、平台等）
- **AI 爬虫识别** — 内置 GPTBot、ClaudeBot、PerplexityBot、CCBot 等 40+ 种爬虫规则，含消息应用链接预览 Bot（Slack、Discord、Telegram）
- **条件匹配** — `satisfies(info, { os: 'iOS', device: 'Mobile' })` 辅助函数，支持 TypeScript 类型检查
- **零依赖** — 无任何运行时依赖，gzip 后体积极小
- **纯函数** — `parseUA()` 无全局状态，天然支持 SSR / Node.js
- **TypeScript** — 完整类型定义，`BrowserName`、`OsName` 等均为精确字面量联合类型
- **Tree-shakeable** — 所有功能按需导入，不引入多余代码

## 为什么选 ua-browser

UA 字符串会撒谎 —— 开了桌面模式的手机、无头浏览器、AI 爬虫都可能伪装成普通用户。ua-browser 额外引入硬件信号与 Client Hints，在 UA 失真时依然准确。

| 能力 | ua-browser | ua-parser-js | bowser | detect-browser |
| :-- | :--: | :--: | :--: | :--: |
| UA 字符串解析 | ✅ | ✅ | ✅ | ✅ |
| 零依赖 | ✅ | ✅ | ✅ | ✅ |
| TypeScript 原生 | ✅ | ✅ | ✅ | ✅ |
| Tree-shakeable | ✅ | ❌ | ✅ | ❌ |
| 硬件信号设备检测（桌面模式下仍准确）| ✅ | ❌ | ❌ | ❌ |
| CPU 架构（Apple Silicon / Intel 区分）| ✅ | ❌ | ❌ | ❌ |
| SSR Client Hints | ✅ | ❌ | ❌ | ❌ |
| 无头浏览器检测 | ✅ | ❌ | ❌ | ❌ |
| AI 爬虫识别 | ✅ 40+ | ❌ | ❌ | ❌ |
| 设备类型（TV / Console / XR）| ✅ | ❌ | ❌ | ❌ |

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
//   browser:        'Chrome',
//   version:        '124.0.0.0',
//   versionMajor:   124,
//   engine:         'Blink',
//   os:             'Windows',
//   osVersion:      '10',
//   device:         'PC',
//   arch:           'x86_64',
//   isWebview:      false,
//   isHeadless:     false,
//   isBot:          false,
//   botName:        'unknown',
//   language:       'zh-CN',
//   platform:       'Win32',
//   connectionType: 'unknown'
// }
```

> 解析任意 UA 字符串请使用命名导出：`parseUA('Mozilla/5.0 ...')`

## 使用

### 浏览器环境（推荐：`detect`）

使用 `detect()` 获得精准设备与架构信息 —— 在 UA 解析的基础上额外采集硬件信号：

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()
console.log(result.device) // 'Mobile' —— 即使开了桌面模式也正确
console.log(result.arch)   // 'arm64' 或 'x86_64'

if (result.device === 'Mobile') {
  // 跳转移动版
}
```

> **注意**：`detect()` 内部调用 Client Hints 高熵 API（`getHighEntropyValues`），该 API 仅在 **HTTPS 或 localhost** 环境下可用。HTTP 页面中调用时会静默降级，浏览器版本和 OS 版本将退回 UA 字符串的冻结值（如 Chrome 版本显示为 `149.0.0.0`，macOS 26+ 显示为 `10.15.7`）。

### 浏览器环境（同步：`uaBrowser`）

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

### 默认导出 `uaBrowser()`

检测当前浏览器环境，自动注入 `navigator` 上下文（语言、平台、MIME 类型等）。

```typescript
uaBrowser()          // 自动读取 navigator.userAgent
parseUA(customUA)    // 解析任意 UA 字符串（无浏览器上下文依赖）
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
  detectBrowser,        // 独立浏览器检测
  detectOS,             // 独立操作系统检测
  detectEngine,         // 独立渲染引擎检测
  detectDevice,         // 独立设备类型检测
  detectArch,           // 独立 CPU 架构检测
  detectHeadless,       // 独立无头浏览器检测
  satisfies,            // 条件匹配辅助函数
  VERSION,              // 当前版本号
} from 'ua-browser'
```

### 返回值 `EnvOption`

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| `browser` | `BrowserName` | 浏览器名称 |
| `version` | `string` | 浏览器版本 |
| `versionMajor` | `number` | 浏览器主版本号（`parseInt(version)`） |
| `engine` | `EngineName` | 渲染内核 |
| `os` | `OsName` | 操作系统 |
| `osVersion` | `string` | 系统版本 |
| `device` | `DeviceName` | 设备类型：`Mobile` \| `Tablet` \| `PC` \| `TV` \| `Console` \| `XR` |
| `arch` | `ArchName` | CPU 架构 |
| `isWebview` | `boolean` | 是否为 Android Webview / iOS WKWebView |
| `isHeadless` | `boolean` | 是否为无头 / 自动化浏览器 |
| `isBot` | `boolean` | 是否为爬虫 / 机器人 |
| `botName` | `BotName` | 爬虫名称 |
| `language` | `string` | 浏览器语言，如 `zh-CN` |
| `platform` | `string` | 平台标识，如 `Win32` |
| `connectionType` | `string` | 网络类型：`4g` \| `3g` \| `2g` \| `slow-2g` \| `unknown` |

> 所有字段在无法识别时统一返回 `'unknown'`，不返回空字符串或 `null`。

## 支持范围

内置超过 70 种浏览器、20 种操作系统、40+ 种爬虫规则，详见 **[内置支持列表](https://yangtianxia.github.io/ua-browser/guide/support-list)**。

部分覆盖：
- **浏览器** — Chrome、Safari、Arc、Brave、Firefox、Edge、Samsung Internet、UC、微信、钉钉、抖音、哔哩哔哩、快手、小红书、飞书等
- **操作系统** — Windows、macOS、Android、iOS、visionOS、tvOS、HarmonyOS、OpenHarmony、Tizen、KaiOS 等
- **AI 爬虫** — GPTBot、ClaudeBot、PerplexityBot、CCBot；消息应用 Bot（Slack、Discord、Telegram、WhatsApp）等
- **设备** — Mobile、Tablet、PC、TV（含三星 Smart TV、HbbTV 标准）、Console（PS5、Xbox、Switch）、XR（Vision Pro、Quest）

## 常见问题

**和 ua-parser-js 有什么区别？**

`ua-parser-js` 专注于 UA 字符串本身的解析，不具备硬件信号采集能力；在手机开启桌面模式或 UA 被篡改时会给出错误结果。ua-browser 额外引入 WebGL 渲染器、Client Hints、CSS `safe-area-inset` 等多维信号，并内置 40+ AI 爬虫识别规则和无头浏览器检测，`ua-parser-js` 均不支持。

**在 Next.js / Nuxt 等 SSR 框架里能用吗？**

可以。`parseUA(ua)` 是纯函数，无任何浏览器 API 依赖，可直接在 Node.js / Edge Runtime 中使用。搭配 `parseHeaders()` 和 `ACCEPT_CH` 还可在服务端利用 Client Hints 获取精准的架构与平台信息。

**手机开了"请求桌面网站"，还能正确识别设备类型吗？**

可以，但需要使用 `uaBrowser.detect()` 或手动调用 `getEnvContext()`。这两种方式会采集 CSS `safe-area-inset`、振动 API、设备像素比等硬件信号，不依赖 UA 字符串里的设备声明。

**如何识别 GPT、Claude 等 AI 爬虫的抓取请求？**

读取返回值的 `isBot` 和 `botName` 字段即可。库内置了 GPTBot、ClaudeBot、PerplexityBot、CCBot 等规则，同时也覆盖 Slack、Discord、Telegram 等消息应用的链接预览 Bot。

**包体积有多大？**

零运行时依赖，gzip 后极小；按需引入（named exports + tree-shaking）体积更小。

## License

[MIT](./LICENSE) © yangtianxia
