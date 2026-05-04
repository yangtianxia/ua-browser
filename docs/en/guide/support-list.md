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
| HarmonyOS | `HarmonyOS` | `2`, `3`, `4` (mapped from Android version); `5.0.0` (HarmonyOS Next, extracted directly) |
| OpenHarmony | `OpenHarmony` | `4.1`, `3.2`... |
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

::: info HarmonyOS version mapping
HarmonyOS 2/3/4 is based on the Android compatibility layer. The UA contains an `Android` version token that is mapped to the HarmonyOS display version:

| Android version | HarmonyOS version |
| :-- | :-- |
| 10 | `2` |
| 11 | `3` |
| 12 | `3` |
| 13 | `4` |

HarmonyOS Next (5.0+) UAs do not contain an `Android` token. The version is extracted directly from `HarmonyOS 5.0.0`.
:::

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
| ArkWeb | `ArkWeb` | HarmonyOS Next built-in rendering engine (explicit token only) |

::: tip Blink upgrade
Before Chrome 28, the engine was WebKit. When Chrome 28+ is detected, the engine is automatically upgraded to `Blink`.
:::

::: info ArkWeb
`ArkWeb` is only returned when the UA string explicitly contains the `ArkWeb` token. HarmonyOS Next UAs without the token are correctly identified as `Blink` (Chromium-based).
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

As of v1.1.0, a four-layer priority chain is used. Earlier layers take precedence:

| Layer | Signal source | Coverage |
| :--: | :-- | :-- |
| 1 | UA Client Hints (`navigator.userAgentData`) | Chrome / Edge — precise |
| 2 | WebGL renderer string | Resolves Apple Silicon vs Intel Mac |
| 3 | `navigator.platform` inference | Synchronous; covers iPhone / iPad / Linux aarch64 |
| 4 | UA string pattern matching | Fallback — same as v1.0 behaviour |

**Output values:**

| Architecture | `ArchName` | Common UA / signal markers |
| :-- | :-- | :-- |
| ARM 64-bit | `arm64` | Client Hints `arm/64`; WebGL `Apple M1/M2/A15`; platform `iPhone/iPad`; UA `aarch64`, `arm64` |
| ARM 32-bit | `arm` | Client Hints `arm/32`; platform `arm`; UA `ARM` |
| x86 64-bit | `x86_64` | Client Hints `x86/64`; WebGL `Intel/AMD/NVIDIA`; platform `Win64`; UA `x86_64`, `WOW64` |
| x86 32-bit | `x86` | Client Hints `x86/32`; platform `Win32`; UA `i686` |
| Unknown | `unknown` | No match in any layer |

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

---

## Runtime Browser Compatibility

This section describes which browsers can **run** `ua-browser` itself — separate from which browsers it can **detect**.

### Core functions

`parseUA()`, `detectBrowser()`, `detectOs()` and all other synchronous detection functions are **pure regex operations** with no browser API dependencies. They run in any modern JS environment (browser, Node.js, Deno, SSR).

### Build output JS syntax

| Feature | Source | Build output (`target: es2018`) |
| :-- | :--: | :-- |
| Optional chaining `?.` | ✓ | Transpiled to `(x == null ? void 0 : x.y)` |
| Nullish coalescing `??` | ✓ | Transpiled to equivalent ES5 form |
| `async / await` | ✓ | Kept as-is (ES2017, within es2018 target) |

**Minimum syntax compatibility:** Chrome 63 / Safari 12 / Firefox 55 / Edge 79 (Chromium)

### `getEnvContext()` API compatibility

| API | Chrome | Safari | Firefox | Edge | Notes |
| :-- | :--: | :--: | :--: | :--: | :-- |
| `canvas` + `measureText` | 9+ | 3.1+ | 3.5+ | 12+ | Font probes for OS confirmation |
| WebGL renderer | 9+ | 8+ | 4+ | 12+ | Resolves Apple Silicon vs Intel Mac |
| `window.matchMedia` | 9+ | 5.1+ | 6+ | 12+ | Pointer / hover capability |
| `navigator.hardwareConcurrency` | 37+ | 10.1+ | 48+ | 15+ | CPU core count |
| `navigator.deviceMemory` | 63+ | ✗ | ✗ | 79+ | Memory size, Chrome-only |
| `userAgentData.getHighEntropyValues` | 90+ | ✗ | ✗ | 90+ | UA Client Hints — most accurate arch source |

::: tip Graceful degradation
All DOM API calls are wrapped in `try/catch` and `typeof window !== 'undefined'` guards. APIs unavailable in Safari or Firefox are silently skipped. `getEnvContext()` never throws in any environment.
:::

### `parseHeaders()` compatibility

Pure server-side function with no browser API dependencies. Client Hints headers (`Sec-CH-UA-Arch`, etc.) are only sent automatically by Chrome / Edge 90+. Safari and Firefox do not send them; in those cases `arch` and other fields fall back to UA string matching.
