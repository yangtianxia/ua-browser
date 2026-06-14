---
title: 快速开始
description: ua-browser 安装与使用教程，零依赖，支持浏览器、Node.js 和 SSR 框架，一行代码检测浏览器、操作系统和设备类型。
---

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

## 为什么 UA 字符串不够用？

UA 字符串是检测浏览器环境的传统方式，但它存在几个已知的失真场景：

| 场景 | UA 字符串的问题 |
| :-- | :-- |
| **Chrome 隐私冻结** | Chrome 109+ 将小版本号固定为 `0.0.0`，`Chrome/149.0.0.0` 是所有 Chrome 149.x 用户的 UA |
| **macOS 26+ 冻结** | Apple 从 macOS 26 起将 Chrome UA 中的系统版本固定为 `Mac OS X 10_15_7` |
| **手机开了桌面模式** | UA 声明为桌面，但设备仍是移动端——屏幕尺寸、触控、安全区均为手机表现 |
| **无头浏览器伪装** | Playwright / Puppeteer 默认 UA 与正常 Chrome 无法区分 |
| **AI 爬虫** | GPTBot、ClaudeBot 等有自己的 UA 格式，纯字符串匹配容易漏报 |

ua-browser 通过 **硬件信号**（WebGL 渲染器、CSS safe-area、振动 API 等）和 **Client Hints**（`Sec-CH-UA-*` / `getHighEntropyValues`）填补这些空白。

## 选择正确的 API

| API | 环境 | 能力 | 适用场景 |
| :-- | :-- | :-- | :-- |
| `uaBrowser.detect()` | 浏览器（异步） | UA + 硬件信号 + Client Hints | **浏览器端首选**，需要精准版本、设备、架构 |
| `uaBrowser()` | 浏览器（同步） | UA + navigator 基础信号 | 无需精确版本、快速读取 |
| `parseHeaders(headers)` | Node.js / SSR | UA + Sec-CH-UA-* 请求头 | 服务端有 Client Hints 头时 |
| `parseUA(ua)` | Node.js / SSR | 纯 UA 字符串 | 服务端无 Client Hints 头 |

---

## 浏览器端（推荐：`detect`）

`detect()` 在 UA 解析基础上额外采集硬件信号，是浏览器端的推荐入口。

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()

console.log(result.version)  // '149.0.7827.102' — 真实版本，非 UA 冻结值
console.log(result.osVersion) // '26.5.1' — 真实 macOS 版本
console.log(result.device)   // 'Mobile' — 即使开了桌面模式也正确
console.log(result.arch)     // 'arm64' — Apple Silicon vs Intel
```

**`detect()` 额外采集的信号：**
- **Client Hints** — 真实浏览器版本（`fullVersionList`）、平台版本（`platformVersion`）、CPU 架构
- **WebGL 渲染器** — GPU 型号，区分 Apple Silicon / Intel / AMD / Qualcomm
- **CSS safe-area-inset** — 识别 iPhone 刘海 / 动态岛，不受 UA 欺骗
- **振动 API / 运动 API** — 区分真实移动设备与仿移动的桌面浏览器

> **注意**：`detect()` 依赖 Client Hints 高熵 API（`getHighEntropyValues`），该 API 仅在 **HTTPS 或 localhost** 下可用。HTTP 页面会静默降级，退回 UA 字符串的冻结值。

---

## 浏览器端（同步：`uaBrowser`）

不需要精确版本或设备类型时，同步调用更简单：

```typescript
import uaBrowser from 'ua-browser'

const { browser, os, device, isBot } = uaBrowser()

if (device === 'Mobile') {
  // 注意：开了桌面模式的手机会被识别为 PC
  // 需要精确设备检测时，请用 uaBrowser.detect()
}
```

**局限性**（与 `detect()` 对比）：
- Chrome 版本为冻结值（`149.0.0.0`）
- macOS 26+ 版本为冻结值（`10.15.7`）
- 无法识别开了桌面模式的手机
- 无法区分 Apple Silicon 与 Intel（arch 返回 `unknown`）

---

## Node.js / SSR（`parseUA`）

纯函数，无浏览器 API 依赖，可直接在 Node.js、Edge Runtime 使用：

```typescript
import { parseUA } from 'ua-browser'

const ua = req.headers['user-agent'] ?? ''
const { browser, os, isBot } = parseUA(ua)

if (isBot) {
  // 拦截爬虫
}
```

---

## Node.js / SSR + Client Hints（`parseHeaders`）

如果你的服务器收到了 `Sec-CH-UA-*` 请求头（Chrome / Edge 90+ 在 HTTPS 下发送），用 `parseHeaders` 可以获取更精准的结果：

```typescript
import { parseHeaders, ACCEPT_CH } from 'ua-browser'

// 第一次响应时写入 Accept-CH，告知浏览器上报 Client Hints
res.setHeader('Accept-CH', ACCEPT_CH)

// 后续请求携带 Sec-CH-UA-* 头后，可精确获取架构、版本、平台
const result = parseHeaders(req.headers)
console.log(result.version) // '149.0.7827.102' — 来自 Sec-CH-UA-Full-Version-List
console.log(result.arch)    // 'x86_64' — 来自 Sec-CH-UA-Arch
console.log(result.osVersion) // '26.5.1' — 来自 Sec-CH-UA-Platform-Version
```

相比 `parseUA`，`parseHeaders` 的优势：
- 可获取真实浏览器完整版本（而非 UA 冻结值）
- 可获取真实 OS 版本（macOS 26+、Windows 10/11 区分）
- 可识别 Brave 浏览器（`Sec-CH-UA` 携带 `"Brave"` 品牌）

---

## 命名导出（Tree-shakeable）

按需引入，未使用的代码会被 tree-shake 掉：

```typescript
import {
  parseUA,           // 纯函数，适合 SSR / Node.js
  parseHeaders,      // 从 HTTP 请求头解析 UA 及 Client Hints
  ACCEPT_CH,         // 响应头常量，告知浏览器上报 Client Hints
  getEnvContext,     // 采集所有浏览器环境信号（Client Hints、WebGL 等）
  getNavContext,     // 读取当前浏览器 navigator 上下文
  getWindowsVersion, // 异步精确区分 Windows 10 / 11
  getLanguage,       // 从 NavContext 获取浏览器语言
  isWebview,         // 检测 Android Webview / iOS WKWebView
  detectBot,         // 独立爬虫检测
  detectBrowser,     // 独立浏览器检测
  detectOS,          // 独立操作系统检测
  detectEngine,      // 独立渲染引擎检测
  detectDevice,      // 独立设备类型检测
  detectArch,        // 独立 CPU 架构检测
  detectHeadless,    // 独立无头浏览器检测
  satisfies,         // 条件匹配辅助函数
  VERSION            // 当前版本号
} from 'ua-browser'
```

---

## CDN 用法

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const info = uaBrowser()
  console.log(info.browser) // 'Chrome'
</script>
```
