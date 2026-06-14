---
title: 介绍
description: ua-browser 是什么、为什么 UA 字符串不够用，以及如何选择正确的 API。
---

# 介绍

## 什么是 ua-browser？

ua-browser 是一个零依赖的 TypeScript 检测库，支持浏览器与 Node.js 双环境。它不只解析 UA 字符串，还通过**硬件信号**和 **Client Hints** 在 UA 失真时给出准确结果。

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

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const info = uaBrowser()
  console.log(info.browser) // 'Chrome'
</script>
```
