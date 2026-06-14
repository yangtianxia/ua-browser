---
title: Browser Usage
description: Use uaBrowser.detect() and synchronous uaBrowser() in the browser to detect browser, OS, and device type.
---

# Browser Usage

## Recommended: `uaBrowser.detect()`

`detect()` collects hardware signals on top of UA parsing and is the **recommended browser-side entry point**.

```typescript
import uaBrowser from 'ua-browser'

const result = await uaBrowser.detect()

console.log(result.version)   // '149.0.7827.102' — real version, not the frozen UA value
console.log(result.osVersion) // '26.5.1' — real macOS version
console.log(result.device)    // 'Mobile' — correct even in desktop mode
console.log(result.arch)      // 'arm64' — Apple Silicon vs Intel
```

**What `detect()` collects beyond the UA string:**

| Signal | Purpose |
| :-- | :-- |
| Client Hints `fullVersionList` | Real browser full version (not the frozen UA value) |
| Client Hints `platformVersion` | Real OS version (macOS 26+, Windows 10/11) |
| WebGL renderer | GPU model — distinguishes Apple Silicon / Intel / AMD / Qualcomm |
| CSS `safe-area-inset` | Detects iPhone notch / Dynamic Island, not spoofable by UA |
| Vibration / motion APIs | Distinguishes real mobile devices from desktop browsers faking mobile |

> **Note**: `detect()` relies on the Client Hints high-entropy API (`getHighEntropyValues`), which is only available in **HTTPS or localhost** contexts. On plain HTTP pages it degrades silently — browser version and OS version fall back to the frozen UA string values (e.g. Chrome reports `149.0.0.0`, macOS 26+ reports `10.15.7`).

---

## Sync: `uaBrowser()`

When you don't need accurate version or device detection, a synchronous call is simpler:

```typescript
import uaBrowser from 'ua-browser'

const { browser, os, device, language } = uaBrowser()

if (device === 'Mobile') {
  // Note: a phone in desktop mode is detected as 'PC' here.
  // Use uaBrowser.detect() when accurate device detection matters.
}
```

**Differences from `detect()`:**

| Field | `uaBrowser()` sync | `uaBrowser.detect()` async |
| :-- | :-- | :-- |
| `version` | Frozen UA value (`149.0.0.0`) | Real version (`149.0.7827.102`) |
| `osVersion` | Frozen UA value (`10.15.7`) | Real version (`26.5.1`) |
| `device` | Phone in desktop mode → `'PC'` | Phone in desktop mode → `'Mobile'` |
| `arch` | `'unknown'` (no Client Hints) | `'arm64'` / `'x86_64'` |

---

## Named Exports (Tree-shakeable)

Import only what you need — unused code is eliminated by tree-shaking:

```typescript
import {
  parseUA,           // pure function, ideal for SSR / Node.js
  parseHeaders,      // parse UA and Client Hints from HTTP headers
  ACCEPT_CH,         // response header constant to request Client Hints
  getEnvContext,     // collect all browser signals (Client Hints, WebGL, etc.)
  getNavContext,     // read current browser navigator context
  getWindowsVersion, // async: accurately distinguish Windows 10 / 11
  getLanguage,       // extract browser language from NavContext
  isWebview,         // detect Android Webview / iOS WKWebView
  detectBot,         // standalone bot detection
  detectBrowser,     // standalone browser detection
  detectOS,          // standalone OS detection
  detectEngine,      // standalone rendering engine detection
  detectDevice,      // standalone device type detection
  detectArch,        // standalone CPU architecture detection
  detectHeadless,    // standalone headless browser detection
  satisfies,         // condition-matching helper
  VERSION            // current library version
} from 'ua-browser'
```
