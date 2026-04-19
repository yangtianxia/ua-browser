# API 参考

## 默认导出

### `uaBrowser(ua?)`

解析 UA 并返回完整的环境信息对象。

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(ua?: string): EnvOption
```

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| `ua` | `string` | 可选。UA 字符串，省略时自动读取 `navigator.userAgent` |

**返回值：** [`EnvOption`](/api/types#envoption)

```typescript
uaBrowser.isWebview(ua: string): boolean
uaBrowser.isWechatMiniapp(): boolean
uaBrowser.getLanguage(): string
uaBrowser.VERSION: string
```

---

## 命名导出

### `parseUA(ua, options?)`

纯函数版本，适合 SSR / Node.js 环境。

```typescript
import { parseUA } from 'ua-browser'

parseUA(ua: string, options?: ParseOptions): EnvOption
```

```typescript
interface ParseOptions {
  nav?: NavContext       // 注入浏览器环境上下文
  windowsVersion?: string | null  // 预先获取的 Windows 版本
}
```

---

### `isWebview(ua)`

检测 UA 中是否包含 `; wv`（Android Webview 标识）。

```typescript
isWebview(ua: string): boolean
```

---

### `isWechatMiniapp()`

检测当前运行环境是否为微信小程序。

```typescript
isWechatMiniapp(): boolean
```

---

### `getWindowsVersion(nav)`

异步获取精确的 Windows 版本（用于区分 Windows 10 / 11）。

```typescript
getWindowsVersion(nav: NavContext): Promise<string | null>
```

需在调用 `parseUA` 前 `await`，然后作为 `windowsVersion` 选项传入。

---

### `detectBot(ua)`

独立爬虫检测器。

```typescript
detectBot(ua: string): { isBot: boolean; botName: BotName }
```

---

### `detectArch(ua)`

独立 CPU 架构检测器。

```typescript
detectArch(ua: string): ArchName
```

---

### `detectHeadless(ua)`

独立无头浏览器检测器。

```typescript
detectHeadless(ua: string): boolean
```

---

### `getLanguage()`

获取标准化的浏览器语言，如 `'zh-CN'`、`'en-US'`。

```typescript
getLanguage(): string
```

---

### `VERSION`

当前库版本号，与 `package.json` 中的 `version` 字段一致。

```typescript
VERSION: string
```
