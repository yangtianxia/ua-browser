---
layout: home

hero:
  name: uaBrowser
  text: Browser Detection Beyond UA Strings
  tagline: UA strings lie. ua-browser combines hardware signals and Client Hints to stay accurate when the UA string can't be trusted. Zero dependencies. Browser and Node.js.
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/getting-started
    - theme: alt
      text: Playground
      link: /en/playground
    - theme: alt
      text: GitHub
      link: https://github.com/yangtianxia/ua-browser

features:
  - icon: 🛰️
    title: Hardware Signal Detection
    details: WebGL renderer, CSS safe-area-inset, device pixel ratio, Vibration API — correctly identifies phones in desktop mode and distinguishes Apple Silicon from Intel Mac.

  - icon: 🔑
    title: Client Hints Support
    details: In the browser, getHighEntropyValues returns real version and arch data. Server-side, parseHeaders reads Sec-CH-UA-* headers for precise detection without guesswork.

  - icon: 🤖
    title: AI Bot Recognition
    details: 40+ built-in bot rules covering GPTBot, ClaudeBot, PerplexityBot, CCBot, and messaging link-preview bots (Slack, Discord, Telegram, WhatsApp).

  - icon: 👻
    title: Headless Browser Detection
    details: Identifies HeadlessChrome, Playwright, Puppeteer, Electron, jsdom, and Selenium environments to block non-human traffic.

  - icon: 🌲
    title: Tree-shakeable
    details: All features are named exports. Import only what you need — Vite, Rollup, and webpack 5+ eliminate unused code automatically.

  - icon: ⚡
    title: Zero Dependencies · Tiny Bundle
    details: No runtime dependencies. Tiny after gzip. Works in browser and Node.js. Full TypeScript support with precise literal union types.
---
