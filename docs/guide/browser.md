---
title: 浏览器端使用
description: 在浏览器中使用 uaBrowser.detect() 和同步 uaBrowser() 检测浏览器、操作系统和设备类型。
---

# 浏览器端使用

## 推荐：`uaBrowser.detect()`

`detect()` 在 UA 解析基础上额外采集硬件信号，是浏览器端的**推荐入口**。

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()

console.log(result.version)   // '149.0.7827.102' — 真实版本，非 UA 冻结值
console.log(result.osVersion) // '26.5.1' — 真实 macOS 版本
console.log(result.device)    // 'Mobile' — 即使开了桌面模式也正确
console.log(result.arch)      // 'arm64' — Apple Silicon vs Intel
```

**`detect()` 额外采集的信号：**

| 信号 | 用途 |
| :-- | :-- |
| Client Hints `fullVersionList` | 真实浏览器完整版本（非 UA 冻结值） |
| Client Hints `platformVersion` | 真实操作系统版本（macOS 26+、Windows 10/11）|
| WebGL 渲染器 | GPU 型号，区分 Apple Silicon / Intel / AMD / Qualcomm |
| CSS `safe-area-inset` | 识别 iPhone 刘海 / 动态岛，不受 UA 欺骗 |
| 振动 / 运动 API | 区分真实移动设备与仿移动的桌面浏览器 |

> **注意**：`detect()` 依赖 Client Hints 高熵 API（`getHighEntropyValues`），该 API 仅在 **HTTPS 或 localhost** 下可用。HTTP 页面会静默降级，退回 UA 字符串的冻结值（如 Chrome 版本显示 `149.0.0.0`，macOS 26+ 显示 `10.15.7`）。

---

## 同步：`uaBrowser()`

不需要精确版本或设备类型时，同步调用更简单，无需 await：

```typescript
import uaBrowser from 'ua-browser'

const { browser, os, device, language } = uaBrowser()

if (device === 'Mobile') {
  // 注意：开了桌面模式的手机会被识别为 PC
  // 需要精确设备检测时，请用 uaBrowser.detect()
}
```

**与 `detect()` 的差异：**

| 字段 | `uaBrowser()` 同步 | `uaBrowser.detect()` 异步 |
| :-- | :-- | :-- |
| `version` | UA 冻结值（`149.0.0.0`）| 真实版本（`149.0.7827.102`）|
| `osVersion` | UA 冻结值（`10.15.7`）| 真实版本（`26.5.1`）|
| `device` | 桌面模式手机 → `'PC'` | 桌面模式手机 → `'Mobile'` |
| `arch` | `'unknown'`（无 Client Hints）| `'arm64'` / `'x86_64'` |

---

## 命名导出（Tree-shakeable）

按需引入单个功能，Vite / Rollup / webpack 5+ 会自动 tree-shake 未使用的代码：

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
