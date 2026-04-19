# Support List

All built-in definitions come from `src/constants/` and are strictly consistent with runtime behavior.

## Browsers

Detection priority runs from lowest to highest. When multiple rules match the same UA, the one with the highest priority wins. App webviews (WeChat, DingTalk, etc.) have the highest priority to prevent them from being overridden by generic Chrome detection.

### General Browsers

| Browser | `BrowserName` | Priority |
| :-- | :-- | :--: |
| Apple Safari | `Safari` | 10 |
| Google Chrome / Chrome iOS | `Chrome` | 20 |
| Microsoft IE | `IE` | 30 |
| Microsoft Edge (all platforms) | `Edge` | 40 |
| Mozilla Firefox / Firefox iOS | `Firefox` | 50 |
| Firefox Focus | `Firefox Focus` | 55 |
| Chromium | `Chromium` | 60 |
| Opera | `Opera` | 70 |
| Vivaldi | `Vivaldi` | 80 |
| Yandex Browser | `Yandex` | 90 |
| Samsung Internet | `Samsung Internet` | 92 |
| DuckDuckGo Browser | `DuckDuckGo` | 94 |
| Puffin | `Puffin` | 96 |
| Arora | `Arora` | 100 |
| Lunascape | `Lunascape` | 110 |
| QupZilla | `QupZilla` | 120 |
| Coc Coc (Vietnam) | `Coc Coc` | 130 |
| Amazon Kindle / Silk | `Kindle` | 140 |
| Iceweasel | `Iceweasel` | 150 |
| Konqueror | `Konqueror` | 160 |
| Iceape | `Iceape` | 170 |
| SeaMonkey | `SeaMonkey` | 180 |
| Epiphany | `Epiphany` | 190 |
| Maxthon | `Maxthon` | 200 |

### Chinese Browsers

| Browser | `BrowserName` | Priority |
| :-- | :-- | :--: |
| 360 Browser (mobile) | `360` | 300 |
| 360 Secure Browser | `360SE` | 310 |
| 360 Speed Browser | `360EE` | 320 |
| UC Browser | `UC` | 330 |
| QQ Browser | `QQBrowser` | 340 |
| QQ App in-app | `QQ` | 345 |
| Baidu Browser / Baidu App | `Baidu` | 350 |
| Sogou Browser | `Sogou` | 360 |
| Liebao Browser | `Liebao` | 370 |
| 2345 Explorer | `2345Explorer` | 380 |
| 115 Browser | `115Browser` | 390 |
| TheWorld Browser | `TheWorld` | 400 |
| Xiaomi MIUI Browser | `XiaoMi` | 410 |
| Vivo Browser | `Vivo` | 420 |
| Huawei Browser | `Huawei` | 430 |
| OPPO / OnePlus Browser | `OPPO` | 440 |
| Quark Browser | `Quark` | 450 |
| Qiyu Browser | `Qiyu` | 460 |

### App Webviews

| App | `BrowserName` | Priority |
| :-- | :-- | :--: |
| WeCom (Enterprise WeChat) | `WechatWork` | 500 |
| WeChat | `Wechat` | 510 |
| Taobao | `Taobao` | 520 |
| Alipay | `Alipay` | 530 |
| Weibo | `Weibo` | 540 |
| Douban | `Douban` | 550 |
| Suning | `Suning` | 560 |
| iQiYi | `iQiYi` | 570 |
| DingTalk | `DingTalk` | 580 |
| TikTok (Douyin) | `Douyin` | 590 |

::: tip WeChat Mini Program
WeChat Mini Programs are detected separately via `isWechatMiniapp()` (relies on the `__wxjs_environment` global). The `browser` field returns `'Wechat Miniapp'`.
:::

---

## Operating Systems

| OS | `OsName` | Version examples |
| :-- | :-- | :-- |
| Windows | `Windows` | `10`, `11`, `8.1`, `8`, `7`, `Vista`, `XP`, `2000` |
| Android | `Android` | `14`, `13`, `12`... |
| iOS | `iOS` | `17.4`, `16.0`... |
| macOS | `MacOS` | `10.15.7`... |
| HarmonyOS | `HarmonyOS` | `2` (mapped from Android version) |
| Chrome OS | `Chrome OS` | — |
| Tizen | `Tizen` | `6.0`, `5.5`... (Samsung Smart TV / wearables) |
| KaiOS | `KaiOS` | `2.5`, `3.0`... (feature phones in developing markets) |
| Linux | `Linux` | — |
| Ubuntu | `Ubuntu` | — |
| Debian | `Debian` | — |
| FreeBSD | `FreeBSD` | — |
| Windows Phone | `Windows Phone` | — |
| BlackBerry | `BlackBerry` | — |
| MeeGo | `MeeGo` | — |
| Symbian | `Symbian` | — |
| WebOS | `WebOS` | — |

::: info Windows NT version mapping

| NT version | Display version |
| :-- | :-- |
| 10.0 | `10` (use `getWindowsVersion()` to distinguish 10/11) |
| 6.3 | `8.1` |
| 6.2 | `8` |
| 6.1 | `7` |
| 6.0 | `Vista` |
| 5.2 / 5.1 | `XP` |
| 5.0 | `2000` |
:::

---

## Rendering Engines

| Engine | `EngineName` | Representative browsers |
| :-- | :-- | :-- |
| Blink | `Blink` | Chrome 28+, Edge (new), Opera 15+ |
| WebKit | `WebKit` | Safari, all iOS browsers |
| Gecko | `Gecko` | Firefox |
| Trident | `Trident` | IE |
| EdgeHTML | `EdgeHTML` | Edge (legacy, < 79) |
| Presto | `Presto` | Opera (legacy, < 15) |
| KHTML | `KHTML` | Konqueror |

::: tip Blink upgrade
Before Chrome 28, the engine was WebKit. When Chrome 28+ is detected, the engine is automatically upgraded to `Blink`.
:::

---

## Device Types

| Type | `DeviceName` | Detection rule |
| :-- | :-- | :-- |
| Mobile | `Mobile` | UA contains `Mobi` or `iPh` |
| Tablet | `Tablet` | UA contains `iPad`, `Tablet`, or `Pad`; Android without `Mobile` marker; iPadOS (`MacIntel` + touch points > 1) |
| Smart TV | `TV` | UA contains `SMART-TV`, `HbbTV`, `SmartTV`, `Android TV`, or `GoogleTV` |
| Desktop | `PC` | None of the above |

---

## CPU Architecture

Rules are evaluated from highest to lowest priority; the first match wins:

| Architecture | `ArchName` | UA markers |
| :-- | :-- | :-- |
| ARM 64-bit | `arm64` | `aarch64`, `arm64`, `ARM64` |
| ARM 32-bit | `arm` | `ARM` (standalone word) |
| x86 64-bit | `x86_64` | `x86_64`, `Win64`, `WOW64`, `x64;`, `amd64` |
| x86 32-bit | `x86` | `i386`, `i686`, `x86;` |
| Unknown | `unknown` | No match |

---

## Bots / Crawlers

### Search Engine Bots

| Bot | `BotName` | Owner |
| :-- | :-- | :-- |
| Googlebot | `Googlebot` | Google |
| Bingbot / BingPreview | `Bingbot` | Microsoft |
| Baiduspider | `Baiduspider` | Baidu |
| Bytespider | `Bytespider` | ByteDance |
| YandexBot | `YandexBot` | Yandex |
| DuckDuckBot | `DuckDuckBot` | DuckDuckGo |
| Slurp | `Slurp` | Yahoo |
| Sogou Spider | `Sogou` | Sogou |
| 360Spider | `360Spider` | 360 |
| PetalBot | `PetalBot` | Huawei |
| Applebot | `Applebot` | Apple |

### AI / LLM Crawlers

| Bot | `BotName` | Owner |
| :-- | :-- | :-- |
| GPTBot | `GPTBot` | OpenAI |
| ClaudeBot | `ClaudeBot` | Anthropic |
| PerplexityBot | `PerplexityBot` | Perplexity AI |
| CCBot | `CCBot` | Common Crawl |
| AdsBot-Google | `AdsBot` | Google Ads |

### Social Media Crawlers

| Bot | `BotName` | Owner |
| :-- | :-- | :-- |
| facebookexternalhit / FacebookBot | `Facebookbot` | Meta |
| Twitterbot | `Twitterbot` | X (Twitter) |
| LinkedInBot | `LinkedInBot` | LinkedIn |

### SEO Tool Crawlers

| Bot | `BotName` | Owner |
| :-- | :-- | :-- |
| SemrushBot | `SemrushBot` | Semrush |
| AhrefsBot | `AhrefsBot` | Ahrefs |
| MJ12bot | `MJ12bot` | Majestic |

### Generic Fallback

Any UA containing `bot`, `crawler`, `spider`, `crawling`, or `scraper` (case-insensitive) is identified as `GenericBot`.

---

## Headless / Automated Browsers

The following UA markers cause `isHeadless` to return `true`:

| Marker | Scenario |
| :-- | :-- |
| `HeadlessChrome` | Chrome launched with `--headless` |
| `Headless` | Generic headless marker |
| `PhantomJS` | PhantomJS |
| `Electron/` | Electron apps |
| `Playwright` | Playwright automation |
| `jsdom/` | Node.js DOM simulation (Jest / Vitest environments) |
| `Selenium` | Some Selenium / WebDriver configurations |

::: warning Note
Cypress and WebdriverIO do not modify the UA by default and cannot be detected at the UA level. Modern stealth libraries (e.g. puppeteer-stealth) can bypass all of the above markers — this detection only covers common unmodified setups.
:::
