# 内置支持列表

所有内置定义均来自源码 `src/constants/`，与运行时行为严格一致。

## 浏览器

检测优先级从低到高，同一 UA 匹配多个规则时优先级高者胜出。App 内嵌 Webview（微信、钉钉等）优先级最高，确保不被通用 Chrome 覆盖。

### 通用浏览器

| 浏览器 | `BrowserName` | 优先级 |
| :-- | :-- | :--: |
| Apple Safari | `Safari` | 10 |
| Google Chrome / Chrome iOS | `Chrome` | 20 |
| Microsoft IE | `IE` | 30 |
| Microsoft Edge（全平台） | `Edge` | 40 |
| Mozilla Firefox / Firefox iOS | `Firefox` | 50 |
| Firefox Focus | `Firefox Focus` | 55 |
| Chromium | `Chromium` | 60 |
| Opera | `Opera` | 70 |
| Vivaldi | `Vivaldi` | 80 |
| Yandex 浏览器 | `Yandex` | 90 |
| Arora | `Arora` | 100 |
| Lunascape | `Lunascape` | 110 |
| QupZilla | `QupZilla` | 120 |
| Coc Coc（越南） | `Coc Coc` | 130 |
| Amazon Kindle / Silk | `Kindle` | 140 |
| Iceweasel | `Iceweasel` | 150 |
| Konqueror | `Konqueror` | 160 |
| Iceape | `Iceape` | 170 |
| SeaMonkey | `SeaMonkey` | 180 |
| Epiphany | `Epiphany` | 190 |
| 傲游浏览器 | `Maxthon` | 200 |

### 国内浏览器

| 浏览器 | `BrowserName` | 优先级 |
| :-- | :-- | :--: |
| 360 浏览器（手机版） | `360` | 300 |
| 360 安全浏览器 | `360SE` | 310 |
| 360 极速浏览器 | `360EE` | 320 |
| UC 浏览器 | `UC` | 330 |
| QQ 浏览器 | `QQBrowser` | 340 |
| QQ 客户端内置 | `QQ` | 345 |
| 百度浏览器 / 百度 App | `Baidu` | 350 |
| 搜狗浏览器 | `Sogou` | 360 |
| 猎豹浏览器 | `Liebao` | 370 |
| 2345 浏览器 | `2345Explorer` | 380 |
| 115 浏览器 | `115Browser` | 390 |
| 世界之窗 | `TheWorld` | 400 |
| 小米 MIUI 浏览器 | `XiaoMi` | 410 |
| Vivo 浏览器 | `Vivo` | 420 |
| 华为浏览器 | `Huawei` | 430 |
| OPPO / OnePlus 浏览器 | `OPPO` | 440 |
| 夸克浏览器 | `Quark` | 450 |
| 旗鱼浏览器 | `Qiyu` | 460 |

### App 内嵌 Webview

| 应用 | `BrowserName` | 优先级 |
| :-- | :-- | :--: |
| 企业微信 | `WechatWork` | 500 |
| 微信 | `Wechat` | 510 |
| 淘宝 | `Taobao` | 520 |
| 支付宝 | `Alipay` | 530 |
| 微博 | `Weibo` | 540 |
| 豆瓣 | `Douban` | 550 |
| 苏宁易购 | `Suning` | 560 |
| 爱奇艺 | `iQiYi` | 570 |
| 钉钉 | `DingTalk` | 580 |
| 抖音 | `Douyin` | 590 |

::: tip 微信小程序
微信小程序通过 `isWechatMiniapp()` 单独检测（依赖 `__wxjs_environment` 全局变量），`browser` 字段返回 `'Wechat Miniapp'`。
:::

---

## 操作系统

| 操作系统 | `OsName` | 版本示例 |
| :-- | :-- | :-- |
| Windows | `Windows` | `10`、`11`、`8.1`、`8`、`7`、`Vista`、`XP`、`2000` |
| Android | `Android` | `14`、`13`、`12`... |
| iOS | `iOS` | `17.4`、`16.0`... |
| macOS | `MacOS` | `10.15.7`... |
| HarmonyOS | `HarmonyOS` | `2`（基于 Android 版本映射） |
| Chrome OS | `Chrome OS` | — |
| Linux | `Linux` | — |
| Ubuntu | `Ubuntu` | — |
| Debian | `Debian` | — |
| FreeBSD | `FreeBSD` | — |
| Windows Phone | `Windows Phone` | — |
| BlackBerry | `BlackBerry` | — |
| MeeGo | `MeeGo` | — |
| Symbian | `Symbian` | — |
| WebOS | `WebOS` | — |

::: info Windows 版本映射
UA 中的 `Windows NT` 版本号映射如下：

| NT 版本 | 显示版本 |
| :-- | :-- |
| 10.0 | `10`（需 `getWindowsVersion()` 区分 10/11） |
| 6.3 | `8.1` |
| 6.2 | `8` |
| 6.1 | `7` |
| 6.0 | `Vista` |
| 5.2 / 5.1 | `XP` |
| 5.0 | `2000` |
:::

---

## 渲染内核

| 内核 | `EngineName` | 代表浏览器 |
| :-- | :-- | :-- |
| Blink | `Blink` | Chrome 28+、Edge（新版）、Opera 15+ |
| WebKit | `WebKit` | Safari、iOS 所有浏览器 |
| Gecko | `Gecko` | Firefox |
| Trident | `Trident` | IE |
| EdgeHTML | `EdgeHTML` | Edge（旧版，< 79） |
| Presto | `Presto` | Opera（旧版，< 15） |
| KHTML | `KHTML` | Konqueror |

::: tip Blink 升级
Chrome 28 之前基于 WebKit。检测到 Chrome 28+ 时，内核自动升级为 `Blink`。
:::

---

## CPU 架构

检测规则按优先级从高到低，首个匹配项胜出：

| 架构 | `ArchName` | UA 特征 |
| :-- | :-- | :-- |
| ARM 64 位 | `arm64` | `aarch64`、`arm64`、`ARM64` |
| ARM 32 位 | `arm` | `ARM`（独立单词） |
| x86 64 位 | `x86_64` | `x86_64`、`Win64`、`WOW64`、`x64;`、`amd64` |
| x86 32 位 | `x86` | `i386`、`i686`、`x86;` |
| 未知 | `unknown` | 无匹配 |

---

## 爬虫 / 机器人

### 搜索引擎爬虫

| 爬虫 | `BotName` | 归属 |
| :-- | :-- | :-- |
| Googlebot | `Googlebot` | Google |
| Bingbot / BingPreview | `Bingbot` | Microsoft |
| Baiduspider | `Baiduspider` | 百度 |
| Bytespider | `Bytespider` | 字节跳动 |
| YandexBot | `YandexBot` | Yandex |
| DuckDuckBot | `DuckDuckBot` | DuckDuckGo |
| Slurp | `Slurp` | Yahoo |
| Sogou Spider | `Sogou` | 搜狗 |
| 360Spider | `360Spider` | 360 |
| PetalBot | `PetalBot` | 华为 |
| Applebot | `Applebot` | Apple |

### 社交媒体爬虫

| 爬虫 | `BotName` | 归属 |
| :-- | :-- | :-- |
| facebookexternalhit / FacebookBot | `Facebookbot` | Meta |
| Twitterbot | `Twitterbot` | X (Twitter) |
| LinkedInBot | `LinkedInBot` | LinkedIn |

### SEO 工具爬虫

| 爬虫 | `BotName` | 归属 |
| :-- | :-- | :-- |
| SemrushBot | `SemrushBot` | Semrush |
| AhrefsBot | `AhrefsBot` | Ahrefs |
| MJ12bot | `MJ12bot` | Majestic |

### 通用兜底

包含 `bot`、`crawler`、`spider`、`crawling`、`scraper`（大小写不敏感）关键词的 UA 将被识别为 `GenericBot`。

---

## 无头 / 自动化浏览器

以下 UA 特征会使 `isHeadless` 返回 `true`：

| 特征 | 场景 |
| :-- | :-- |
| `HeadlessChrome` | Chrome 无头模式 |
| `PhantomJS` | PhantomJS |
| `Electron/` | Electron 应用 |
| `Playwright` | Playwright 自动化测试 |
