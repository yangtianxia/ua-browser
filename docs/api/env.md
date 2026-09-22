---
title: Env Context — getEnvContext() and getNavContext()
description: Signals a UA string can't see — GPU, screen, Client Hints, iOS 26's frozen version. Covers getEnvContext(), getNavContext(), getWindowsVersion(), getLanguage().
---

# Environment Context


---

## `getEnvContext()` {#getenvcontext}

Collects every available browser signal in one call and returns an [`EnvContext`](/api/types#envcontext) object — pass it to `parseUA({ ctx })` to enable multi-signal detection.

```typescript
import { getEnvContext } from 'ua-browser'

getEnvContext(): Promise<EnvContext>
```

**Returns:** `Promise<`[`EnvContext`](/api/types#envcontext)`>`

**Signals it collects:**

| Category | Signals |
| :-- | :-- |
| Client Hints | `platform`, `platformVersion`, `architecture`, `fullVersionList` |
| WebGL | GPU renderer + vendor, max texture size, compressed texture formats (ASTC/ETC2/PVRTC/S3TC) |
| Screen | `devicePixelRatio`, `screenWidth`, `screenHeight` |
| CSS env | `safe-area-inset-top` (iOS notch / Dynamic Island) |
| Hardware APIs | `hardwareConcurrency`, `deviceMemory`, Vibration API, DeviceMotion events |
| Input | `pointerType` (`coarse`/`fine`/`none`), hover capability |
| Network | `connection.effectiveType`, `connection.saveData` |
| Audio | Sample rate |
| Fonts | OS-specific font availability probe |
| iOS 26 | CSS feature detection (`isIOS26Plus`) to correct the frozen UA on iOS 26+ |

::: warning iOS 26 version detection
Since iOS 26, Apple freezes `CPU iPhone OS` in the UA at `18_7`, so pure UA parsing reports the wrong system version. `getEnvContext()` confirms iOS 26+ through CSS feature detection and corrects `osVersion` to `'26'` (the major version).

For the exact minor version (`26.0`–`26.5`), use [`probeIOS26Version()`](#probeios26version).
:::

**Example:**

```typescript
import { getEnvContext, parseUA } from 'ua-browser'

const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })

console.log(result.device)   // 'Mobile' — correct even in desktop mode
console.log(result.arch)     // 'arm64' (Apple Silicon) or 'x86_64' (Intel)
console.log(result.language) // 'zh-CN'
```

**Notes:**
- Browser only. Safe to call in Node.js — every DOM access is guarded, `undefined` is returned, and the result is equivalent to `getNavContext()`.
- Each DOM API is wrapped in its own `try/catch`, so a single denied permission does not block the remaining signals.
- If you don't need to reuse the `ctx` object, `uaBrowser.detect()` is simpler.

---

---

## `getNavContext()` {#getnavcontext}

Reads the current browser's `navigator` and returns a [`NavContext`](/api/types#navcontext) object. In Node.js it returns a safe empty object, so callers need no environment checks.

```typescript
import { getNavContext } from 'ua-browser'

getNavContext(): NavContext
```

**Returns:** [`NavContext`](/api/types#navcontext)

**Example:**

```typescript
const nav = getNavContext()
const result = parseUA(navigator.userAgent, { nav })

console.log(result.language) // 'zh-CN'
console.log(result.platform) // 'Win32'
```

**Notes:**
- When you also need architecture or device-precision signals, prefer `getEnvContext()`.
- `getNavContext()` is synchronous; `getEnvContext()` is asynchronous.

---

---

## `getWindowsVersion(nav)` {#getwindowsversion}

Fetches the exact Windows version asynchronously, to tell Windows 10 from Windows 11 — their UA strings are identical (`Windows NT 10.0`).

```typescript
import { getWindowsVersion, getNavContext, parseUA } from 'ua-browser'

getWindowsVersion(nav: NavContext): Promise<string | null>
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `nav` | [`NavContext`](/api/types#navcontext) | Yes | Browser context; pass the return value of `getNavContext()` |

**Returns:** `Promise<string | null>` — a version string (such as `'11'`, `'10'`), or `null` when unavailable

**Example:**

```typescript
const nav = getNavContext()
const windowsVersion = await getWindowsVersion(nav)
const result = parseUA(navigator.userAgent, { nav, windowsVersion })

console.log(result.osVersion) // '11' or '10'
```

**Notes:**
- Requires `navigator.userAgentData.getHighEntropyValues()` (Chrome 90+, Edge 90+).
- Returns `null` on Firefox, Safari, and Node.js, in which case `osVersion` falls back to the UA-derived value.
- `getEnvContext()` calls this internally; use it standalone only when you need `NavContext`-level context without paying for a full `EnvContext`.

---

---

## `getLanguage(nav)` {#getlanguage}

Extracts a normalized browser language from a [`NavContext`](/api/types#navcontext). Normalizes the tag to BCP 47 form (e.g. `'en-us'` → `'en-US'`, `'ZH_CN'` → `'zh-CN'`).

```typescript
import { getLanguage, getNavContext } from 'ua-browser'

getLanguage(nav: NavContext): string
```

| Parameter | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `nav` | [`NavContext`](/api/types#navcontext) | Yes | Browser context |

**Returns:** `string` — normalized language tag such as `'zh-CN'` or `'en-US'`; `'unknown'` when unavailable.

**Example:**

```typescript
const nav = getNavContext()
console.log(getLanguage(nav)) // 'zh-CN'
```

---

---

## `probeIOS26Version()` {#probeios26version}

Probes the exact iOS 26 minor version through CSS / JavaScript feature detection. Returns `'26.0'`–`'26.5'`, or `null` outside an iOS 26+ environment.

> **Requirement**: this function is only meaningful in a browser. It always returns `null` in Node.js.

```typescript
import { probeIOS26Version } from 'ua-browser'

probeIOS26Version(): string | null
```

**Returns:** `string | null`

**How it decides:**

| Return value | Evidence |
| :-- | :-- |
| `'26.5'` | The `Origin` API exists (new in Safari 26.5) |
| `'26.4'` | `PerformanceResourceTiming.finalResponseHeadersStart` exists |
| `'26.3'` | `NavigateEvent.prototype.signal` exists |
| `'26.2'` | `Math.sumPrecise` exists |
| `'26.0'` | `CSS.supports('animation-timeline', 'view()')` is `true` |
| `null` | Not Safari/WebKit 26+ (iOS 18 or earlier) |

**Example:**

```typescript
import { probeIOS26Version, getEnvContext, parseUA } from 'ua-browser'

// Option B: getEnvContext corrects osVersion to '26' (the major version) automatically
const ctx = await getEnvContext()
const result = parseUA(navigator.userAgent, { ctx })
console.log(result.osVersion) // '26' on iOS 26+

// Option A: the exact minor version
const exact = probeIOS26Version()
console.log(exact) // '26.5', '26.4', '26.3', '26.2', '26.0', or null
```

::: tip
The two work best together: `parseUA` handles every field, and `probeIOS26Version()` is called separately when you need an exact iOS 26 minor version.
:::

---
