---
layout: home

hero:
  name: uaBrowser
  text: 浏览器环境检测
  tagline: 通过 User Agent 检测浏览器、系统及设备类型，支持 Node.js，零依赖
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
  - icon: 🔍
    title: 全面检测
    details: 浏览器名称、版本、渲染内核、操作系统、设备类型、CPU 架构，一次解析全部获取

  - icon: 🤖
    title: 爬虫识别
    details: 内置 18 种主流爬虫（Googlebot、Bingbot、Bytespider 等）检测，支持通用兜底

  - icon: 👻
    title: 无头检测
    details: 识别 HeadlessChrome、PhantomJS、Electron、Playwright 等自动化环境

  - icon: 🌲
    title: Tree-shakeable
    details: 支持命名导出，按需引入单个检测器，不引入无用代码

  - icon: ⚡
    title: 零依赖
    details: 无任何运行时依赖，浏览器与 Node.js 环境均可使用，gzip 后约 5KB

  - icon: 🔒
    title: 类型安全
    details: 完整 TypeScript 类型定义，所有返回值均为字面量联合类型
---
