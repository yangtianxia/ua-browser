---
title: 默认导出
description: uaBrowser() 同步检测和 uaBrowser.detect() 异步高精度检测的 API 文档。
---

# 默认导出


---

## `uaBrowser()` {#uabrowser}

检测当前浏览器环境，返回完整的环境信息对象。自动读取 `navigator.userAgent` 并注入 `navigator` 上下文（语言、平台、触控点数）。

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(): EnvOption
```

**返回值：** [`EnvOption`](/api/types#envoption)

**示例：**

```typescript
const info = uaBrowser()
console.log(info.browser) // 'Chrome'
console.log(info.os)      // 'Windows'
```

**注意事项：**
- 无法判断的字段返回 `'unknown'`，不会返回空字符串。
- 在 Node.js 中 `navigator` 不可用，`language` 和 `platform` 将为 `'unknown'`。
- 若需要解析任意 UA 字符串，请使用 [`parseUA()`](#parseua)。
- 若需要更高精度，浏览器端请使用 [`uaBrowser.detect()`](#uabrowser-detect)。

默认导出对象同时挂载了以下静态成员：

```typescript
uaBrowser.detect(): Promise<EnvOption>
uaBrowser.isWebview(ua: string): boolean
uaBrowser.getLanguage(): string
uaBrowser.VERSION: string
```

---

---

## `uaBrowser.detect()` {#uabrowser-detect}

`uaBrowser()` 的异步高精度版本。内部先调用 [`getEnvContext()`](#getenvcontext) 采集硬件与浏览器信号，再执行解析，能更准确地识别设备类型和 CPU 架构。

**这是浏览器端代码的推荐入口。**

```typescript
uaBrowser.detect(): Promise<EnvOption>
```

**返回值：** `Promise<`[`EnvOption`](/api/types#envoption)`>`

**`detect()` 采集的信号：**

| 信号 | 用途 |
| :-- | :-- |
| Client Hints (`Sec-CH-UA-*`) | 精确版本、平台、架构 |
| WebGL 渲染器 / 厂商 | GPU 类型 → 判断移动端 vs. 桌面端、Apple Silicon vs. Intel |
| CSS `env(safe-area-inset-top)` | iOS 刘海 / 灵动岛 → 确认为移动设备 |
| `devicePixelRatio` | 手机（≥3）vs. Mac（2）vs. 显示器（1–2） |
| 振动 / DeviceMotion API | 仅移动端有效 → 确认移动设备意图 |
| 网络类型（`connection.effectiveType`）| 辅助设备分类 |
| 字体探针 | 操作系统级字体可用性 |

**示例：**

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()
console.log(result.device) // 'Mobile' — 即便开了桌面模式也能正确识别
console.log(result.arch)   // 'arm64' 或 'x86_64'
```

**注意事项：**
- 仅限浏览器环境。在 Node.js 中 `getEnvContext()` 返回空上下文，结果等同于 `uaBrowser()`。
- 所有 DOM 访问均包裹在 `try/catch` 中，不会抛出异常。

---