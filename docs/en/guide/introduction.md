---
title: Introduction
description: What ua-browser is, why UA strings aren't enough, and how to choose the right API.
---

# Introduction

## What is ua-browser?

ua-browser is a zero-dependency TypeScript detection library that works in both browser and Node.js environments. It goes beyond parsing UA strings by using **hardware signals** and **Client Hints** to stay accurate when the UA string is frozen or spoofed.

## Why UA Strings Aren't Enough

UA strings are the traditional way to detect the browser environment, but they break down in several well-known scenarios:

| Scenario | The problem |
| :-- | :-- |
| **Chrome privacy freeze** | Chrome 109+ locks the minor version to `0.0.0` — `Chrome/149.0.0.0` is every Chrome 149.x user's UA |
| **macOS 26+ freeze** | Apple froze the macOS version in Chrome's UA at `Mac OS X 10_15_7` starting from macOS 26 |
| **Phone in desktop mode** | The UA claims desktop, but the device is still a phone — screen size, touch, and safe-area all say mobile |
| **Headless browser spoofing** | Playwright and Puppeteer default UAs are indistinguishable from real Chrome |
| **AI crawlers** | GPTBot, ClaudeBot, and similar bots use their own UA format — string matching misses or misidentifies them |

ua-browser fills these gaps using **hardware signals** (WebGL renderer, CSS safe-area, Vibration API, etc.) and **Client Hints** (`Sec-CH-UA-*` / `getHighEntropyValues`).

## Choosing the Right API

| API | Environment | Capability | Use when |
| :-- | :-- | :-- | :-- |
| `uaBrowser.detect()` | Browser (async) | UA + hardware signals + Client Hints | **Browser-side default** — need accurate version, device, arch |
| `uaBrowser()` | Browser (sync) | UA + basic navigator signals | Quick read, version accuracy not required |
| `parseHeaders(headers)` | Node.js / SSR | UA + Sec-CH-UA-* request headers | Server-side with Client Hints headers available |
| `parseUA(ua)` | Node.js / SSR | UA string only | Server-side with no Client Hints headers |

## Installation

::: code-group

```sh [npm]
npm i ua-browser
```

```sh [pnpm]
pnpm add ua-browser
```

```sh [yarn]
yarn add ua-browser
```

:::

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ua-browser/dist/index.min.js"></script>
<script>
  const info = uaBrowser()
  console.log(info.browser) // 'Chrome'
</script>
```
