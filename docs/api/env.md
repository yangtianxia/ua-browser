---
title: 环境上下文
description: getEnvContext()、getNavContext()、getWindowsVersion() 和 getLanguage() 的 API 文档。
---

# 环境上下文


---

## `getEnvContext()` {#getenvcontext}

一次性采集当前浏览器的所有可用信号，返回 [`EnvContext`](/api/types#envcontext) 对象，再传给 `parseUA({ ctx })` 以启用多信号检测。

```typescript
import { getEnvContext } from 'ua-browser'

getEnvContext(): Promise<EnvContext>
```

**返回值：** `Promise<`[`EnvContext`](/api/types#envcontext)`>`

**采集的信号：**

| 类别 | 信号 |
| :-- | :-- |
| Client Hints | `platform`、`platformVersion`、`architecture`、`fullVersionList` |
| WebGL | GPU 渲染器 + 厂商、最大纹理尺寸、压缩纹理格式（ASTC/ETC2/PVRTC/S3TC） |
| 屏幕 | `devicePixelRatio`、`screenWidth`、`screenHeight` |
| CSS env | `safe-area-inset-top`（iOS 刘海 / 灵动岛） |
| 硬件 API | `hardwareConcurrency`、`deviceMemory`、振动 API、DeviceMotion 事件 |
| 输入 | `pointerType`（`coarse`/`fine`/`none`）、hover 能力 |
| 网络 | `connection.effectiveType`、`connection.saveData` |
| 音频 | 采样率 |
| 字体 | 操作系统专属字体可用性探针 |
| iOS 26 | CSS 特性检测（`isIOS26Plus`），用于修正 iOS 26+ 的冻结 UA |

::: warning iOS 26 版本检测说明
从 iOS 26 起，Apple 将 UA 中的 `CPU iPhone OS` 冻结在 `18_7`，导致纯 UA 解析返回错误的系统版本。`getEnvContext()` 会通过 CSS 特性检测自动确认是否为 iOS 26+，并将 `osVersion` 修正为 `'26'`（主版本号）。

若需获取精确的小版本号（`26.0`–`26.5`），请使用 [`probeIOS26Version()`](#probeios26version)。
:::

**示例：**

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.device)   // 'Mobile' — 开了桌面模式也能正确识别
console.log(result.arch)     // 'arm64'（Apple Silicon）或 'x86_64'（Intel）
console.log(result.language) // 'zh-CN'
```

**注意事项：**
- 仅限浏览器环境。在 Node.js 中调用是安全的——所有 DOM 访问均有保护，返回 `undefined`，结果等同于 `getNavContext()`。
- 每个 DOM API 均单独包裹在 `try/catch` 中，单个权限拒绝不会阻断其余信号采集。
- 如果不需要复用 `ctx` 对象，直接使用 `uaBrowser.detect()` 更简洁。

---

---

## `getNavContext()` {#getnavcontext}

读取当前浏览器的 `navigator`，返回 [`NavContext`](/api/types#navcontext) 对象。在 Node.js 中返回安全的空对象，调用方无需做环境判断。

```typescript
import { getNavContext } from 'ua-browser'

getNavContext(): NavContext
```

**返回值：** [`NavContext`](/api/types#navcontext)

**示例：**

```typescript
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })

console.log(result.language) // 'zh-CN'
console.log(result.platform) // 'Win32'
```

**注意事项：**
- 同时需要架构 / 设备精度信号时，优先使用 `getEnvContext()`。
- `getNavContext()` 是同步的；`getEnvContext()` 是异步的。

---

---

## `getWindowsVersion(nav)` {#getwindowsversion}

异步获取精确的 Windows 版本，用于区分 Windows 10 与 Windows 11（两者 UA 字符串相同，均为 `Windows NT 10.0`）。

```typescript
import { getWindowsVersion, getNavContext, parseUA } from 'ua-browser'

getWindowsVersion(nav: NavContext): Promise<string | null>
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `nav` | [`NavContext`](/api/types#navcontext) | 是 | 浏览器上下文，传入 `getNavContext()` 的返回值 |

**返回值：** `Promise<string | null>` — 版本字符串（如 `'11'`、`'10'`）或 `null`（不可用时）

**示例：**

```typescript
const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '11' 或 '10'
```

**注意事项：**
- 依赖 `navigator.userAgentData.getHighEntropyValues()`（Chrome 90+、Edge 90+）。
- Firefox、Safari 及 Node.js 返回 `null`，`osVersion` 回退到 UA 派生值。
- `getEnvContext()` 内部已调用此函数；仅在需要 `NavContext` 级上下文而不想承担完整 `EnvContext` 开销时才单独使用。

---

---

## `getLanguage(nav)` {#getlanguage}

从 [`NavContext`](/api/types#navcontext) 中提取标准化的浏览器语言。将语言标签规范化为 BCP 47 格式（如 `'en-us'` → `'en-US'`，`'ZH_CN'` → `'zh-CN'`）。

```typescript
import { getLanguage, getNavContext } from 'ua-browser'

getLanguage(nav: NavContext): string
```

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| `nav` | [`NavContext`](/api/types#navcontext) | 是 | 浏览器上下文 |

**返回值：** `string` — 标准化语言标签，如 `'zh-CN'`、`'en-US'`，不可用时返回 `'unknown'`。

**示例：**

```typescript
const nav = getNavContext()
console.log(getLanguage(nav)) // 'zh-CN'
```

---

---

## `probeIOS26Version()` {#probeios26version}

通过 CSS / JavaScript 特性检测探测 iOS 26 的精确小版本号。返回 `'26.0'`–`'26.5'` 或 `null`（非 iOS 26+ 环境）。

> **前提**：此函数仅在浏览器环境中有意义。在 Node.js 中始终返回 `null`。

```typescript
import { probeIOS26Version } from 'ua-browser'

probeIOS26Version(): string | null
```

**返回值：** `string | null`

**检测原理：**

| 返回值 | 判断依据 |
| :-- | :-- |
| `'26.5'` | `Origin` API 存在（Safari 26.5 新增） |
| `'26.4'` | `PerformanceResourceTiming.finalResponseHeadersStart` 存在 |
| `'26.3'` | `NavigateEvent.prototype.signal` 存在 |
| `'26.2'` | `Math.sumPrecise` 存在 |
| `'26.0'` | `CSS.supports('animation-timeline', 'view()')` 为 `true` |
| `null` | 非 Safari/WebKit 26+（iOS 18 或以下） |

**示例：**

```typescript
import { probeIOS26Version, getEnvContext, parseUA } from 'ua-browser'

// B 方案：getEnvContext 自动将 osVersion 修正为 '26'（主版本）
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })
console.log(result.osVersion) // '26'（iOS 26+ 时）

// A 方案：精确小版本
const exact = probeIOS26Version()
console.log(exact) // '26.5'、'26.4'、'26.3'、'26.2'、'26.0' 或 null
```

::: tip
两者结合使用效果最佳：`parseUA` 负责所有字段的综合解析，`probeIOS26Version()` 仅在需要精确 iOS 26 小版本时单独调用。
:::

---