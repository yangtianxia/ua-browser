# uaBrowser - 浏览器检测

通过 User Agent 和浏览器环境变量检测浏览器、系统及设备类型，支持 Node.js 环境，零依赖。

[![npm version](https://img.shields.io/npm/v/ua-browser)](https://www.npmjs.com/package/ua-browser)
[![license](https://img.shields.io/npm/l/ua-browser)](./LICENSE)

**[📖 文档](https://yangtianxia.github.io/ua-browser/)** · **[🎮 Playground](https://yangtianxia.github.io/ua-browser/playground)**

## 安装

```sh
npm i ua-browser
# or
pnpm add ua-browser
# or
yarn add ua-browser
```

## 快速开始

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

## Node.js / SSR

在服务端使用 `parseUA` 纯函数，传入来自请求头的 UA 字符串：

```typescript
import { parseUA } from 'ua-browser'

const ua = req.headers['user-agent'] ?? ''
const result = parseUA(ua)

console.log(result.browser) // 'Chrome'
console.log(result.os)      // 'Windows'
```

## 精确 Windows 11 检测

Windows 11 与 Windows 10 的 UA 字符串相同，需借助 `navigator.userAgentData` 异步获取：

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '11' 或 '10'
```

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const info = uaBrowser()
  console.log(info.browser) // 'Chrome'
</script>
```

## 命名导出（tree-shakeable）

```typescript
import {
  parseUA,          // 纯函数，适合 SSR / Node.js，可注入环境上下文
  isWebview,        // 检测 Android Webview
  isWechatMiniapp,  // 检测微信小程序
  getNavContext,    // 读取当前浏览器 navigator 上下文
  getLanguage,      // 获取浏览器语言
  getWindowsVersion,// 异步获取精确 Windows 11/10 版本
  detectBot,        // 单独使用爬虫检测
  detectArch,       // 单独使用 CPU 架构检测
  detectHeadless,   // 单独使用无头浏览器检测
  VERSION           // 当前版本号
} from 'ua-browser'
```

## 返回字段

### `uaBrowser(ua?: string): EnvOption`

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| `browser` | `BrowserName` | 浏览器名称 |
| `version` | `string` | 浏览器版本 |
| `engine` | `EngineName` | 渲染内核 |
| `os` | `OsName` | 操作系统 |
| `osVersion` | `string` | 系统版本 |
| `device` | `DeviceName` | 设备类型：`'Mobile'` \| `'Tablet'` \| `'PC'` |
| `arch` | `ArchName` | CPU 架构 |
| `isWebview` | `boolean` | 是否为 Android Webview |
| `isHeadless` | `boolean` | 是否为无头/自动化浏览器 |
| `isBot` | `boolean` | 是否为爬虫/机器人 |
| `botName` | `BotName` | 爬虫名称 |
| `language` | `string` | 浏览器语言，如 `'zh-CN'` |
| `platform` | `string` | 平台信息，如 `'Win32'` |

检测不到时所有字段均返回 `'unknown'`，不返回空字符串或 `null`。

## License

MIT
