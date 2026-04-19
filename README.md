# uaBrowser - 浏览器检测

通过 User Agent 和浏览器环境变量检测浏览器、系统及设备类型，支持 Node.js 环境，零依赖。

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

## 命名导出（tree-shakeable）

```typescript
import {
  parseUA,          // 纯函数，可注入环境上下文
  isWebview,        // 检测 Android Webview
  isWechatMiniapp,  // 检测微信小程序
  getLanguage,      // 获取浏览器语言
  getWindowsVersion,// 异步获取 Windows 11/10 版本
  detectBot,        // 单独使用爬虫检测
  detectArch,       // 单独使用架构检测
  detectHeadless,   // 单独使用无头浏览器检测
  VERSION           // 当前版本号
} from 'ua-browser'
```

## API

### `uaBrowser(ua?: string): EnvOption`

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| `browser` | `BrowserName` | 浏览器名称 |
| `version` | `string` | 浏览器版本 |
| `engine` | `EngineName` | 渲染内核 |
| `os` | `OsName` | 操作系统 |
| `osVersion` | `string` | 系统版本 |
| `device` | `DeviceName` | 设备类型 |
| `arch` | `ArchName` | CPU 架构 |
| `isWebview` | `boolean` | 是否为 Android Webview |
| `isHeadless` | `boolean` | 是否为无头/自动化浏览器 |
| `isBot` | `boolean` | 是否为爬虫/机器人 |
| `botName` | `BotName` | 爬虫名称 |
| `language` | `string` | 浏览器语言 |
| `platform` | `string` | 平台信息 |

## License

MIT
