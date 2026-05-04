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
| Samsung Internet | `Samsung Internet` | 92 |
| DuckDuckGo 浏览器 | `DuckDuckGo` | 94 |
| Puffin | `Puffin` | 96 |
| Coc Coc（越南） | `Coc Coc` | 130 |
| Amazon Kindle / Silk | `Kindle` | 140 |
| Konqueror | `Konqueror` | 160 |
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
| 哔哩哔哩 | `Bilibili` | 592 |
| 快手 | `Kuaishou` | 594 |
| 小红书 | `Xiaohongshu` | 596 |
| 飞书 / Lark | `Feishu` | 597 |
| 今日头条 | `Toutiao` | 598 |
| 京东（拼购） | `JD` | 599 |
| 美团 | `Meituan` | 600 |

::: tip 小程序检测
各平台小程序通过运行时全局变量检测，`browser` 字段返回对应 Miniapp 值：

| 平台 | 辅助函数 | `browser` 返回值 | 全局变量 |
| :-- | :-- | :-- | :-- |
| 微信 | `isWechatMiniapp()` | `'Wechat Miniapp'` | `__wxjs_environment` |
| 支付宝 | `isAlipayMiniapp()` | `'Alipay Miniapp'` | `window.my.getSystemInfo` |
| 百度 | `isBaiduMiniapp()` | `'Baidu Miniapp'` | `swan.getSystemInfo` |
| 抖音 | `isDouyinMiniapp()` | `'Douyin Miniapp'` | `tt.getSystemInfo` |
| QQ | `isQQMiniapp()` | `'QQ Miniapp'` | `qq.getSystemInfo` |
| 快手 | `isKuaishouMiniapp()` | `'Kuaishou Miniapp'` | `ks.getSystemInfo` |
:::



---

## 操作系统

| 操作系统 | `OsName` | 版本示例 |
| :-- | :-- | :-- |
| Windows | `Windows` | `10`、`11`、`8.1`、`8`、`7`、`Vista`、`XP`、`2000` |
| Android | `Android` | `14`、`13`、`12`... |
| iOS | `iOS` | `17.4`、`16.0`... |
| macOS | `MacOS` | `10.15.7`... |
| HarmonyOS | `HarmonyOS` | `2`、`3`、`4`（Android 版本映射）；`5.0.0`（HarmonyOS Next 直接提取） |
| OpenHarmony | `OpenHarmony` | `4.1`、`3.2`... |
| Chrome OS | `Chrome OS` | — |
| Tizen | `Tizen` | `6.0`、`5.5`...（三星智能电视 / 可穿戴） |
| KaiOS | `KaiOS` | `2.5`、`3.0`...（发展中国家功能机） |
| Linux | `Linux` | — |
| Ubuntu | `Ubuntu` | — |
| Debian | `Debian` | — |
| FreeBSD | `FreeBSD` | — |
| Windows Phone | `Windows Phone` | — |
| BlackBerry | `BlackBerry` | — |
| MeeGo | `MeeGo` | — |
| Symbian | `Symbian` | — |
| WebOS | `WebOS` | — |

::: info HarmonyOS 版本映射
HarmonyOS 2/3/4 基于 Android 兼容层，UA 含 `Android` 字段，版本通过映射表推算：

| Android NT 版本 | HarmonyOS 版本 |
| :-- | :-- |
| 10 | `2` |
| 11 | `3` |
| 12 | `3` |
| 13 | `4` |

HarmonyOS Next（5.0+）UA 不含 `Android` 字段，版本从 `HarmonyOS 5.0.0` 直接提取。
:::

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
| ArkWeb | `ArkWeb` | HarmonyOS Next 内置渲染引擎（部分 UA 显式携带） |

::: tip Blink 升级
Chrome 28 之前基于 WebKit。检测到 Chrome 28+ 时，内核自动升级为 `Blink`。
:::

::: info ArkWeb
ArkWeb 仅在 HarmonyOS Next 的部分 UA 中显式出现 `ArkWeb` token。无该 token 的 HarmonyOS UA 仍会正确识别为 `Blink`（基于 Chromium 内核）。
:::

---

## 设备类型

| 类型 | `DeviceName` | 判断规则 |
| :-- | :-- | :-- |
| 手机 | `Mobile` | UA 含 `Mobi` 或 `iPh` |
| 平板 | `Tablet` | UA 含 `iPad`、`Tablet`、`Pad`；或 Android 无 `Mobile` 标识；或 iPadOS（`MacIntel` + 触点 > 1） |
| 智能电视 | `TV` | UA 含 `SMART-TV`、`HbbTV`、`SmartTV`、`Android TV`、`GoogleTV` |
| 桌面 | `PC` | 以上均不匹配 |

---

## CPU 架构

v1.1.0 起采用四层优先级检测链，前层成功则跳过后层：

| 层级 | 数据来源 | 覆盖场景 |
| :--: | :-- | :-- |
| 1 | UA Client Hints（`navigator.userAgentData`） | Chrome / Edge，精确 |
| 2 | WebGL 渲染器字符串 | 解决 Apple Silicon vs Intel Mac 问题 |
| 3 | `navigator.platform` 推断 | 同步，覆盖 iPhone / iPad / Linux aarch64 |
| 4 | UA 字符串模式匹配 | 兜底，与 v1.0 行为一致 |

**输出值：**

| 架构 | `ArchName` | 常见 UA / 信号特征 |
| :-- | :-- | :-- |
| ARM 64 位 | `arm64` | Client Hints `arm/64`；WebGL `Apple M1/M2/A15`；platform `iPhone/iPad`；UA `aarch64`、`arm64` |
| ARM 32 位 | `arm` | Client Hints `arm/32`；platform `arm`；UA `ARM` |
| x86 64 位 | `x86_64` | Client Hints `x86/64`；WebGL `Intel/AMD/NVIDIA`；platform `Win64`；UA `x86_64`、`WOW64` |
| x86 32 位 | `x86` | Client Hints `x86/32`；platform `Win32`；UA `i686` |
| 未知 | `unknown` | 以上均无匹配 |

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

### AI / LLM 爬虫

| 爬虫 | `BotName` | 归属 |
| :-- | :-- | :-- |
| GPTBot | `GPTBot` | OpenAI |
| ClaudeBot | `ClaudeBot` | Anthropic |
| PerplexityBot | `PerplexityBot` | Perplexity AI |
| CCBot | `CCBot` | Common Crawl |
| AdsBot-Google | `AdsBot` | Google Ads |

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
| `HeadlessChrome` | Chrome 无头模式（`--headless`） |
| `Headless` | 通用无头标识 |
| `PhantomJS` | PhantomJS |
| `Electron/` | Electron 应用 |
| `Playwright` | Playwright 自动化测试 |
| `jsdom/` | Node.js DOM 模拟（Jest / Vitest 测试环境） |
| `Selenium` | 部分 Selenium / WebDriver 配置 |

::: warning 注意
Cypress、WebdriverIO 默认不修改 UA，无法从 UA 层面检测。现代隐身模式（如 puppeteer-stealth）可绕过以上所有标识，本检测仅覆盖未经伪装的常见场景。
:::

---

## 运行时浏览器兼容性

本节说明 `ua-browser` 自身代码能在哪些浏览器中运行，与「能检测哪些浏览器」是两个独立问题。

### 核心函数

`parseUA()`、`detectBrowser()`、`detectOs()` 等所有同步检测函数为**纯正则运算**，无任何浏览器 API 依赖，可在所有现代 JS 环境（浏览器、Node.js、Deno、SSR）中运行。

### 构建产物 JS 语法

| 特性 | 源码 | 构建产物（`target: es2018`） |
| :-- | :--: | :-- |
| 可选链 `?.` | ✓ | 转译为 `(x == null ? void 0 : x.y)` |
| 空值合并 `??` | ✓ | 转译为等价 ES5 写法 |
| `async / await` | ✓ | 保留（ES2017，在 es2018 目标范围内）|

**最低语法兼容版本：** Chrome 63 / Safari 12 / Firefox 55 / Edge 79（Chromium）

### `getEnvContext()` 各 API 兼容性

| API | Chrome | Safari | Firefox | Edge | 说明 |
| :-- | :--: | :--: | :--: | :--: | :-- |
| `canvas` + `measureText` | 9+ | 3.1+ | 3.5+ | 12+ | 字体探针，用于确认 OS 检测结果 |
| `WebGL` 渲染器 | 9+ | 8+ | 4+ | 12+ | 解决 Apple Silicon vs Intel Mac |
| `window.matchMedia` | 9+ | 5.1+ | 6+ | 12+ | 触屏 / 悬停能力检测 |
| `navigator.hardwareConcurrency` | 37+ | 10.1+ | 48+ | 15+ | CPU 核心数 |
| `navigator.deviceMemory` | 63+ | ✗ | ✗ | 79+ | 内存大小，Chrome 独有 |
| `userAgentData.getHighEntropyValues` | 90+ | ✗ | ✗ | 90+ | UA Client Hints，最精确的 arch 来源 |

::: tip 降级策略
所有 DOM API 调用均包裹在 `try/catch` 与 `typeof window !== 'undefined'` 判断中。Safari / Firefox 不支持的 API 会静默跳过，`getEnvContext()` 在任何环境下都不会抛出异常。
:::

### `parseHeaders()` 兼容性

纯服务端函数，无浏览器 API 依赖。Client Hints 头部（`Sec-CH-UA-Arch` 等）仅 Chrome / Edge 90+ 会自动发送；Safari / Firefox 不发送，此时 `arch` 等字段退回到 UA 字符串匹配结果。
