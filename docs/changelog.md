# 更新日志

## v1.0.1

### 新增

- 新增浏览器检测：Samsung Internet、DuckDuckGo、Puffin
- 新增 AI 爬虫检测：GPTBot、ClaudeBot、PerplexityBot、CCBot、AdsBot
- 新增操作系统检测：Tizen、KaiOS
- 新增设备类型：`TV`（智能电视）
- 无头浏览器检测补充 jsdom、Selenium、Playwright 标记

### 修复

- Android 设备无 `Mobile` 标记时误判为 PC，现正确识别为平板

### 文档

- Playground 支持中英文界面切换
- 新增完整英文文档站（VitePress i18n 双语）

---

## v1.0.0

### 新增

- 爬虫检测：`isBot`、`botName` 字段，支持 18 种主流爬虫
- CPU 架构检测：`arch` 字段（`x86` / `x86_64` / `arm` / `arm64`）
- 无头浏览器检测：`isHeadless` 字段（HeadlessChrome、PhantomJS、Electron、Playwright）
- 命名导出：`parseUA`、`detectBot`、`detectArch`、`detectHeadless` 等，支持 tree-shaking

### 变更

- `device: 'Pc'` → `device: 'PC'`
- `result.platfrom` → `result.platform`（修正拼写错误）
- 移除 `EnvPart` 类型，统一使用 `EnvOption`

### 重构

- 架构拆分为 `constants/`、`detectors/`、`utils/` 模块
- 纯函数 `parseUA()` 替代单例类，消除状态突变
- TypeScript 升级至 5.x，构建工具迁移至 tsup

---

## v0.1.9

修复部分边界 UA 识别问题。

## v0.1.7

新增 Webview 检测支持。

## v0.1.0

初始版本发布。
