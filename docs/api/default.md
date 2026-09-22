---
title: Default Export — uaBrowser() and detect()
description: uaBrowser() for a synchronous result, uaBrowser.detect() when Client Hints and hardware signals matter — which entry point to call, and when.
---

# Default Export


---

## `uaBrowser()` {#uabrowser}

Detects the current browser environment and returns a complete environment info object. It reads `navigator.userAgent` automatically and injects the `navigator` context (language, platform, touch points).

```typescript
import uaBrowser from 'ua-browser'

uaBrowser(): EnvOption
```

**Returns:** [`EnvOption`](/api/types#envoption)

**Example:**

```typescript
const info = uaBrowser()
console.log(info.browser) // 'Chrome'
console.log(info.os)      // 'Windows'
```

**Notes:**
- Fields that cannot be determined return `'unknown'` — never an empty string.
- In Node.js `navigator` is unavailable, so `language` and `platform` are `'unknown'`.
- To parse an arbitrary UA string, use [`parseUA()`](/api/parse#parseua).
- For higher accuracy in the browser, use [`uaBrowser.detect()`](#uabrowser-detect).

The default export also carries the following static members:

```typescript
uaBrowser.detect(): Promise<EnvOption>
uaBrowser.isWebview(ua: string): boolean
uaBrowser.getLanguage(): string
uaBrowser.VERSION: string
```

---

---

## `uaBrowser.detect()` {#uabrowser-detect}

The async, high-accuracy version of `uaBrowser()`. It first calls [`getEnvContext()`](/api/env#getenvcontext) to collect hardware and browser signals, then runs detection — identifying device type and CPU architecture more reliably.

**This is the recommended entry point for browser-side code.**

```typescript
uaBrowser.detect(): Promise<EnvOption>
```

**Returns:** `Promise<`[`EnvOption`](/api/types#envoption)`>`

**Signals collected by `detect()`:**

| Signal | Purpose |
| :-- | :-- |
| Client Hints (`Sec-CH-UA-*`) | Exact version, platform, architecture |
| WebGL renderer / vendor | GPU type → mobile vs. desktop, Apple Silicon vs. Intel |
| CSS `env(safe-area-inset-top)` | iOS notch / Dynamic Island → confirms a mobile device |
| `devicePixelRatio` | Phone (≥3) vs. Mac (2) vs. monitor (1–2) |
| Vibration / DeviceMotion API | Mobile-only → confirms mobile intent |
| Network type (`connection.effectiveType`) | Helps classify the device |
| Font probe | OS-level font availability |

**Example:**

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()
console.log(result.device) // 'Mobile' — detected correctly even in desktop mode
console.log(result.arch)   // 'arm64' or 'x86_64'
```

**Notes:**
- Browser only. In Node.js `getEnvContext()` returns an empty context, so the result is equivalent to `uaBrowser()`.
- All DOM access is wrapped in `try/catch` — it never throws.

---
