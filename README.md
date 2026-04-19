# uaBrowser - 浏览器检测

通过 User Agent 和浏览器环境变量检测浏览器、系统及设备类型，支持 Node.js 环境，零依赖。

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

默认导出，解析 UA 并返回完整的环境信息对象。

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
| `botName` | `BotName` | 爬虫名称（非爬虫时为 `'unknown'`） |
| `language` | `string` | 浏览器语言，如 `'zh-CN'` |
| `platform` | `string` | 平台信息，如 `'Win32'` |

### `parseUA(ua: string, options?): EnvOption`

纯函数版本，适合 SSR / Node.js 环境。

```typescript
import { parseUA, getWindowsVersion, getNavContext } from 'ua-browser'

// 基础用法
const result = parseUA(ua)

// 注入浏览器上下文（获取语言、平台、MIME类型等）
const nav = getNavContext()
const result = parseUA(ua, { nav })

// 精确 Windows 11 检测（需提前 await）
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(ua, { nav, windowsVersion })
```

### 工具方法

```typescript
// 检测 Android Webview（UA 中含 "; wv"）
uaBrowser.isWebview(ua: string): boolean

// 检测微信小程序环境
uaBrowser.isWechatMiniapp(): boolean

// 获取标准化浏览器语言
uaBrowser.getLanguage(): string

// 当前版本
uaBrowser.VERSION: string
```

## 类型定义

### 浏览器 `BrowserName`

```typescript
type BrowserName =
  | 'Safari' | 'Chrome' | 'IE' | 'Edge' | 'Firefox' | 'Firefox Focus'
  | 'Firefox Nightly' | 'Chromium' | 'Opera' | 'Vivaldi' | 'Yandex'
  | 'Arora' | 'Lunascape' | 'QupZilla' | 'Coc Coc' | 'Kindle'
  | 'Iceweasel' | 'Konqueror' | 'Iceape' | 'SeaMonkey' | 'Epiphany'
  | '360' | '360EE' | '360SE' | 'UC' | 'QQBrowser' | 'QQ' | 'Baidu'
  | 'Maxthon' | 'Sogou' | 'Liebao' | '2345Explorer' | '115Browser'
  | 'TheWorld' | 'XiaoMi' | 'Vivo' | 'Huawei' | 'OPPO' | 'Quark'
  | 'Qiyu' | 'Wechat' | 'Wechat Miniapp' | 'WechatWork' | 'Taobao'
  | 'Alipay' | 'Weibo' | 'Douban' | 'Suning' | 'iQiYi' | 'DingTalk'
  | 'Douyin' | 'unknown'
```

### 内核 `EngineName`

```typescript
type EngineName =
  | 'Trident' | 'Presto' | 'WebKit' | 'Gecko'
  | 'KHTML' | 'Blink' | 'EdgeHTML' | 'unknown'
```

### 操作系统 `OsName`

```typescript
type OsName =
  | 'Windows' | 'Linux' | 'MacOS' | 'Android' | 'HarmonyOS'
  | 'Ubuntu' | 'FreeBSD' | 'Debian' | 'Windows Phone'
  | 'BlackBerry' | 'MeeGo' | 'Symbian' | 'iOS' | 'Chrome OS'
  | 'WebOS' | 'unknown'
```

### 设备类型 `DeviceName`

```typescript
type DeviceName = 'Mobile' | 'Tablet' | 'PC'
```

### CPU 架构 `ArchName`

```typescript
type ArchName = 'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'
```

### 爬虫名称 `BotName`

```typescript
type BotName =
  | 'Googlebot' | 'Bingbot' | 'Baiduspider' | 'Bytespider'
  | 'YandexBot' | 'DuckDuckBot' | 'Slurp' | 'Sogou' | '360Spider'
  | 'Applebot' | 'Facebookbot' | 'Twitterbot' | 'LinkedInBot'
  | 'SemrushBot' | 'AhrefsBot' | 'MJ12bot' | 'PetalBot'
  | 'GenericBot' | 'unknown'
```

## 浏览器支持列表

| 浏览器 | 标识 |
| :-- | :-- |
| 苹果默认浏览器 | `Safari` |
| 谷歌浏览器 | `Chrome` |
| 微软 IE | `IE` |
| 微软 Edge | `Edge` |
| 火狐浏览器 | `Firefox` |
| Firefox Focus | `Firefox Focus` |
| Firefox Nightly | `Firefox Nightly` |
| 谷歌开源版 | `Chromium` |
| Opera | `Opera` |
| Vivaldi | `Vivaldi` |
| Yandex 浏览器 | `Yandex` |
| Arora | `Arora` |
| Lunascape | `Lunascape` |
| QupZilla | `QupZilla` |
| Coc Coc（越南） | `Coc Coc` |
| 亚马逊 Kindle | `Kindle` |
| Iceweasel | `Iceweasel` |
| Konqueror | `Konqueror` |
| Iceape | `Iceape` |
| SeaMonkey | `SeaMonkey` |
| Epiphany | `Epiphany` |
| 360 浏览器（手机版） | `360` |
| 360 安全浏览器 | `360SE` |
| 360 极速浏览器 | `360EE` |
| UC 浏览器 | `UC` |
| QQ 浏览器 | `QQBrowser` |
| QQ 客户端 | `QQ` |
| 百度浏览器 | `Baidu` |
| 傲游浏览器 | `Maxthon` |
| 搜狗浏览器 | `Sogou` |
| 猎豹浏览器 | `Liebao` |
| 2345 浏览器 | `2345Explorer` |
| 115 浏览器 | `115Browser` |
| 世界之窗 | `TheWorld` |
| 小米浏览器 | `XiaoMi` |
| Vivo 浏览器 | `Vivo` |
| 华为浏览器 | `Huawei` |
| OPPO 浏览器 | `OPPO` |
| 夸克浏览器 | `Quark` |
| 旗鱼浏览器 | `Qiyu` |
| 微信 | `Wechat` |
| 微信小程序 | `Wechat Miniapp` |
| 企业微信 | `WechatWork` |
| 淘宝 | `Taobao` |
| 支付宝 | `Alipay` |
| 微博 | `Weibo` |
| 豆瓣 | `Douban` |
| 苏宁易购 | `Suning` |
| 爱奇艺 | `iQiYi` |
| 钉钉 | `DingTalk` |
| 抖音 | `Douyin` |

## 从 v0.x 迁移

| v0.x | v1.0 |
| :-- | :-- |
| `result.platfrom` | `result.platform`（拼写修正） |
| `EnvPart` 类型 | 已移除，直接使用 `EnvOption` |
| 仅默认导出 | 新增命名导出（tree-shakeable） |
| 单例类，有状态突变 | `parseUA()` 纯函数 |
| `device: 'Pc'` | `device: 'PC'` |
| 无 bot/arch/headless 字段 | 新增 `isBot`、`botName`、`arch`、`isHeadless` |
