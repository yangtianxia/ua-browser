---
title: Playground — try ua-browser online
description: Try ua-browser live — paste any User-Agent string or pick a preset and see the full parse result instantly in your browser.
layout: page
---

<div class="pg-wrap">
<div class="pg-header">

# Playground

Your current browser is detected the moment you open this page. Switch to "API Testing" to pick a preset or paste any UA string and instantly see the full parse result.

</div>

<Playground />
</div>

## What the playground shows

The playground runs ua-browser directly in your page — nothing is sent to a server. Paste any User-Agent string, or pick a preset from the dropdown, and every field the library parses is displayed side by side:

- **Browser, engine, OS, and device type** — with the exact version and major version
- **CPU architecture and bitness**, when Client Hints or hardware signals expose them
- **Headless and automation flags** — HeadlessChrome, Playwright, Puppeteer, Electron, jsdom, Selenium
- **AI crawler and link-preview bot matches** — GPTBot, ClaudeBot, PerplexityBot, and 40+ more rules
- **Raw environment signals** collected live by `getEnvContext()` in your own browser

New to the library? Start with [Getting Started](/guide/getting-started), check the [Support List](/guide/support-list) for everything detected out of the box, or read the [API Reference](/api/) for full signatures.

