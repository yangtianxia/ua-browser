# ua-browser

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

- `result.platfrom`（拼写错误）已更正为 `result.platform`
- 移除 `EnvPart` 类型，统一使用 `EnvOption`
- 移除单例模式，改为纯函数 `parseUA(ua, options?)`

#### 新增功能

- **`parseUA(ua, options?)`** — 纯函数版本，适用于 SSR / Node.js 环境
- **`getNavContext()`** — 读取真实 `navigator` 并返回 `NavContext`，Node.js 下安全降级
- **`getWindowsVersion(nav)`** — 异步精确区分 Windows 10 / 11
- **`detectBot(ua)`** — 独立爬虫检测器，返回 `{ isBot, botName }`
- **`detectArch(ua)`** — 独立 CPU 架构检测器
- **`detectHeadless(ua)`** — 独立无头浏览器检测器
- **`getLanguage(nav)`** — 从 `NavContext` 提取标准化语言代码
- **`VERSION`** — 导出当前库版本号
- 新增命名导出，支持 Tree-shaking
- 新增 `NavContext` 注入机制，消除全局副作用，所有检测器可在 Node.js 测试

#### 检测能力扩展

- 新增浏览器：Samsung Internet、DuckDuckGo、Puffin
- 新增操作系统：Tizen、KaiOS
- 新增设备类型：`TV`（智能电视）
- 新增 Android 无 `Mobile` 标记时自动识别为平板
- 新增 AI 爬虫检测：GPTBot、ClaudeBot、PerplexityBot、CCBot、AdsBot
- 新增无头浏览器标记：jsdom、Selenium、Playwright

#### 构建系统

- 从 Rollup + Babel + shelljs 迁移至 **tsup + TypeScript 5**
- 产物格式：ESM（`.mjs`）、CommonJS（`.cjs`）、IIFE（`.min.js`）、类型声明（`.d.ts` / `.d.cts`）
- 新增 **Vitest** 测试套件

---

## 0.1.9

### Patch Changes

- fix 修复版本问题
