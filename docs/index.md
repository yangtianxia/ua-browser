---
layout: home

hero:
  name: uaBrowser
  text: 超越 UA 字符串的浏览器检测
  tagline: UA 字符串会撒谎。ua-browser 结合硬件信号与 Client Hints，在 UA 失真时依然准确。零依赖，支持浏览器与 Node.js。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: Playground
      link: /playground
    - theme: alt
      text: GitHub
      link: https://github.com/yangtianxia/ua-browser

features:
  - icon: 🛰️
    title: 硬件信号检测
    details: WebGL 渲染器、CSS safe-area-inset、设备像素比、振动 API——开了桌面模式的手机、Apple Silicon vs Intel，都能正确识别。

  - icon: 🔑
    title: Client Hints 支持
    details: 浏览器端通过 getHighEntropyValues 获取真实版本与架构；服务端通过 parseHeaders 读取 Sec-CH-UA-* 头，精准检测无需猜测。

  - icon: 🤖
    title: AI 爬虫识别
    details: 内置 40+ 爬虫规则，涵盖 GPTBot、ClaudeBot、PerplexityBot、CCBot，以及 Slack、Discord、Telegram 等消息预览 Bot。

  - icon: 👻
    title: 无头浏览器检测
    details: 识别 HeadlessChrome、Playwright、Puppeteer、Electron、jsdom 等自动化环境，有效拦截非人类流量。

  - icon: 🌲
    title: Tree-shakeable
    details: 所有功能命名导出，按需引入单个检测器，Vite / Rollup / webpack 5+ 自动 tree-shake，不引入无用代码。

  - icon: ⚡
    title: 零依赖 · 极小体积
    details: 无任何运行时依赖，gzip 后极小，浏览器与 Node.js 双环境可用，TypeScript 原生支持。
---
