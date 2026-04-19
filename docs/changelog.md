# 更新日志

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
