# ua-browser

## 1.4.0

### Minor Changes

- **EnvOption 新增六个字段**，与 ua-parser-js / device-detector-js 看齐：
  - `vendor` + `model`：设备厂商和型号（如 Samsung/SM-G991B、Apple/iPhone），支持 17 家厂商
  - `browserType`：浏览器类型分类（`'browser' | 'brand' | 'app' | 'unknown'`）
  - `engineVersion`：渲染引擎版本号（如 `'537.36'`、`'605.1.15'`）
  - `osVersionName`：操作系统版本名称（如 `'Sonoma'`、`'Windows 11'`）
  - `botCategory`：Bot 分类（`'search-engine' | 'ai-llm' | 'social' | 'link-preview' | 'seo-tool' | 'monitoring' | 'generic' | 'unknown'`）
- **独立检测器增强**：`detectBrowser()` 返回 `browserType`，`detectEngine()` 返回 `{ engine, engineVersion }`，`detectOS()` 返回 `osVersionName`，`detectBot()` 返回 `botCategory`；新增 `detectVendorModel()` 独立导出
- **新增导出类型**：`BotCategory`、`BrowserType`、`VendorModelResult`
- **Bot 检测扩展**：新增 9 个 AI/LLM 爬虫（`Applebot-Extended`、`OAI-SearchBot`、`ChatGPT-User`、`Google-Extended`、`Meta-ExternalAgent`、`Amazonbot`、`Diffbot`、`cohere-ai`、`YouBot`）；新增 `customBotDefs` 注入自定义 Bot 规则
- **浏览器**：新增 Arc、Brave 检测（Brave 需运行时 API）
- **操作系统**：新增 visionOS、tvOS 检测
- **设备类型**：新增 `Console`（PlayStation、Xbox、Nintendo Switch）、`XR`（Apple Vision Pro、Meta Quest）
- **语言检测**：从 UA 字符串识别 `Language/xx_XX` 格式语言标识，支持三段式 BCP47 标签（微信、支付宝等常见格式）
- **UA 冻结防御**：`ctx.highEntropyData.fullVersionList` 可用时优先使用 Client Hints 精确版本号（Chrome、Edge、Opera、Vivaldi）
- **新增 `EnvOption` 字段**：`versionMajor`（浏览器版本主号）、`connectionType`（网络类型）

### Patch Changes

- 新增独立检测器导出：`detectEngine()`、`detectDevice()`
- 移除 Playground 无意义的重新检测按钮

### 破坏性变更

- 移除 `DetectStrategy`、`strategy` 选项及 `confidence` 字段

## 1.3.1

### Patch Changes

- 新增 uaBrowser.detect() 异步检测方法及 EnvContext 优化

## 1.3.0

### Minor Changes

- 移除小程序运行时检测功能：`isWechatMiniapp`、`isAlipayMiniapp`、`isBaiduMiniapp`、`isDouyinMiniapp`、`isQQMiniapp`、`isKuaishouMiniapp` 及 `parse.ts` 中对应检测块。各平台在 web-view 组件中注入全局变量的方式各有差异，当前实现可靠性存在不确定性，待验证各平台官方文档后重新实现

## 1.2.0

### Minor Changes

- 新增七款主流 App 内嵌 Webview 检测：哔哩哔哩、快手、小红书、飞书/Lark、今日头条、京东、美团

- 新增六平台小程序运行时检测及辅助函数：

  - 微信：`isWechatMiniapp()`（原有）→ `browser: 'Wechat Miniapp'`
  - 支付宝：`isAlipayMiniapp()` → `browser: 'Alipay Miniapp'`
  - 百度：`isBaiduMiniapp()` → `browser: 'Baidu Miniapp'`
  - 抖音：`isDouyinMiniapp()` → `browser: 'Douyin Miniapp'`
  - QQ：`isQQMiniapp()` → `browser: 'QQ Miniapp'`
  - 快手：`isKuaishouMiniapp()` → `browser: 'Kuaishou Miniapp'`

- 移除 5 个已停更浏览器：Arora、Lunascape、QupZilla、Iceweasel、Iceape

## 1.1.0

### Minor Changes

- 新增多信号融合检测架构：

  - `getEnvContext()` 一次性采集所有浏览器环境信号（WebGL、Client Hints、字体探针、CSS media features）
  - `ParseOptions.ctx` 新选项，将 EnvContext 传入 `parseUA()` 以启用多信号检测
  - `parseHeaders()` + `ACCEPT_CH` 常量：服务端通过 HTTP Client Hints 头部实现精准检测（SSR 场景）
  - `detectArch()` 升级为四层优先级链（Client Hints → WebGL → platform → UA 字符串）
  - `isWebview()` 新增 iOS WKWebView 检测（补充 Android `;wv` 现有逻辑）
  - HarmonyOS Next（5.0+）版本直接提取，无需依赖 Android 兼容层版本号
  - 新增 HarmonyOS 版本映射（Android 11→3、12→3、13→4）
  - 新增 OpenHarmony OS 检测（独立 OsName）
  - 新增 ArkWeb 引擎检测

## 1.0.2

### Patch Changes

- 修复 OS 检测顺序及 iOS Safari 版本误判

  - 修复 Chrome OS 被误识别为 Linux（Chrome OS UA 含 X11）
  - 修复 HarmonyOS 被误识别为 Android（HarmonyOS UA 含 Android）
  - 修复 Windows Phone 被误识别为 Windows（Windows Phone UA 含 Windows）
  - 修复 iOS 26+ Safari osVersion 显示冻结值（18.7）而非 Version/ 真实版本
  - 修复 Playground 手机端边距过大导致结果只显示一列的问题

## 1.0.1

### Patch Changes

- 新增浏览器、爬虫、操作系统检测支持，完善文档与国际化

  - 新增浏览器检测：Samsung Internet、DuckDuckGo、Puffin
  - 新增 AI 爬虫检测：GPTBot、ClaudeBot、PerplexityBot、CCBot、AdsBot
  - 新增操作系统检测：Tizen、KaiOS
  - 新增设备类型：TV（智能电视），修复 Android 平板识别缺失
  - 无头浏览器检测补充 jsdom、Selenium、Playwright 标记
  - Playground 支持中英文界面切换
  - 新增完整英文 VitePress 文档站（i18n 双语）

## 1.0.0

### Major Changes

**架构重写，全面升级为模块化纯函数设计。**

#### 破坏性变更

- \`result.platfrom\`（拼写错误）已更正为 \`result.platform\`
- 移除 \`EnvPart\` 类型，统一使用 \`EnvOption\`
- 移除单例模式，改为纯函数 \`parseUA(ua, options?)\`

#### 新增功能

- **\`parseUA(ua, options?)\`** — 纯函数版本，适用于 SSR / Node.js 环境
- **\`getNavContext()\`** — 读取真实 \`navigator\` 并返回 \`NavContext\`，Node.js 下安全降级
- **\`getWindowsVersion(nav)\`** — 异步精确区分 Windows 10 / 11
- **\`detectBot(ua)\`** — 独立爬虫检测器，返回 \`{ isBot, botName }\`
- **\`detectArch(ua)\`** — 独立 CPU 架构检测器
- **\`detectHeadless(ua)\`** — 独立无头浏览器检测器
- **\`getLanguage(nav)\`** — 从 \`NavContext\` 提取标准化语言代码
- **\`VERSION\`** — 导出当前库版本号
- 新增命名导出，支持 Tree-shaking
- 新增 \`NavContext\` 注入机制，消除全局副作用，所有检测器可在 Node.js 测试

#### 检测能力扩展

- 新增浏览器：Samsung Internet、DuckDuckGo、Puffin
- 新增操作系统：Tizen、KaiOS
- 新增设备类型：\`TV\`（智能电视）
- 新增 Android 无 \`Mobile\` 标记时自动识别为平板
- 新增 AI 爬虫检测：GPTBot、ClaudeBot、PerplexityBot、CCBot、AdsBot
- 新增无头浏览器标记：jsdom、Selenium、Playwright

#### 构建系统

- 从 Rollup + Babel + shelljs 迁移至 **tsup + TypeScript 5**
- 产物格式：ESM（\`.mjs\`）、CommonJS（\`.cjs\`）、IIFE（\`.min.js\`）、类型声明（\`.d.ts\` / \`.d.cts\`）
- 新增 **Vitest** 测试套件

---

## 0.1.9

### Patch Changes

- 修复版本解析边界问题
