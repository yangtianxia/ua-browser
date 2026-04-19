import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'uaBrowser',
  description: '通过 User Agent 检测浏览器、系统及设备类型，零依赖',
  base: '/ua-browser/',

  head: [
    ['link', { rel: 'icon', href: '/ua-browser/favicon.ico' }],
    ['script', {}, `var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "https://hm.baidu.com/hm.js?039f7362d3cebddced40c9a853536a89";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})();`],
  ],

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: 'Playground', link: '/playground' },
          { text: '更新日志', link: '/changelog' },
        ],

        sidebar: [
          {
            text: '指南',
            items: [
              {
                text: '快速开始',
                link: '/guide/getting-started',
                collapsed: false,
                items: [
                  { text: '安装', link: '/guide/getting-started#安装' },
                  { text: '基本用法', link: '/guide/getting-started#基本用法' },
                  { text: '命名导出', link: '/guide/getting-started#命名导出-tree-shakeable' },
                  { text: 'Node.js / SSR', link: '/guide/getting-started#nodejs--ssr-用法' },
                  { text: 'CDN', link: '/guide/getting-started#浏览器-cdn-用法' },
                  { text: '独立检测器', link: '/guide/getting-started#独立检测器' },
                ],
              },
              {
                text: '使用示例',
                link: '/guide/examples',
                collapsed: false,
                items: [
                  { text: '设备跳转', link: '/guide/examples#设备跳转' },
                  { text: '拦截爬虫请求', link: '/guide/examples#拦截爬虫请求' },
                  { text: '拦截无头浏览器', link: '/guide/examples#拦截无头浏览器' },
                  { text: '按浏览器加载兼容代码', link: '/guide/examples#按浏览器加载兼容代码' },
                  { text: '微信环境检测', link: '/guide/examples#微信环境检测' },
                  { text: 'SSR / Node.js', link: '/guide/examples#ssr--nodejs-中解析请求-ua' },
                  { text: 'Windows 10 / 11', link: '/guide/examples#精确区分-windows-10--11' },
                  { text: 'Vue 组合式函数', link: '/guide/examples#vue-组合式函数封装' },
                  { text: 'React Hook', link: '/guide/examples#react-hook-封装' },
                  { text: '独立检测器', link: '/guide/examples#按需使用独立检测器' },
                  { text: '统计上报', link: '/guide/examples#统计上报' },
                ],
              },
              {
                text: '内置支持列表',
                link: '/guide/support-list',
                collapsed: false,
                items: [
                  { text: '浏览器', link: '/guide/support-list#浏览器' },
                  { text: '操作系统', link: '/guide/support-list#操作系统' },
                  { text: '渲染内核', link: '/guide/support-list#渲染内核' },
                  { text: '设备类型', link: '/guide/support-list#设备类型' },
                  { text: 'CPU 架构', link: '/guide/support-list#cpu-架构' },
                  { text: '爬虫 / 机器人', link: '/guide/support-list#爬虫--机器人' },
                  { text: '无头 / 自动化浏览器', link: '/guide/support-list#无头--自动化浏览器' },
                ],
              },
            ],
          },
          {
            text: 'API 参考',
            items: [
              {
                text: '总览',
                link: '/api/',
                collapsed: false,
                items: [
                  { text: '默认导出', link: '/api/#默认导出' },
                  { text: '命名导出', link: '/api/#命名导出' },
                ],
              },
              {
                text: '类型定义',
                link: '/api/types',
                collapsed: false,
                items: [
                  { text: 'EnvOption', link: '/api/types#envoption' },
                  { text: 'BrowserName', link: '/api/types#browsername' },
                  { text: 'EngineName', link: '/api/types#enginename' },
                  { text: 'OsName', link: '/api/types#osname' },
                  { text: 'DeviceName', link: '/api/types#devicename' },
                  { text: 'ArchName', link: '/api/types#archname' },
                  { text: 'BotName', link: '/api/types#botname' },
                  { text: 'NavContext', link: '/api/types#navcontext' },
                  { text: 'ParseOptions', link: '/api/types#parseoptions' },
                ],
              },
            ],
          },
        ],

        outline: { level: [2, 3], label: '本页目录' },
      },
    },

    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'Playground', link: '/en/playground' },
          { text: 'Changelog', link: '/en/changelog' },
        ],

        sidebar: [
          {
            text: 'Guide',
            items: [
              {
                text: 'Getting Started',
                link: '/en/guide/getting-started',
                collapsed: false,
                items: [
                  { text: 'Installation', link: '/en/guide/getting-started#installation' },
                  { text: 'Basic Usage', link: '/en/guide/getting-started#basic-usage' },
                  { text: 'Named Exports', link: '/en/guide/getting-started#named-exports-tree-shakeable' },
                  { text: 'Node.js / SSR', link: '/en/guide/getting-started#nodejs--ssr' },
                  { text: 'CDN', link: '/en/guide/getting-started#browser-cdn' },
                  { text: 'Standalone Detectors', link: '/en/guide/getting-started#standalone-detectors' },
                ],
              },
              {
                text: 'Examples',
                link: '/en/guide/examples',
                collapsed: false,
                items: [
                  { text: 'Device Redirect', link: '/en/guide/examples#device-redirect' },
                  { text: 'Block Bot Requests', link: '/en/guide/examples#block-bot-requests' },
                  { text: 'Block Headless Browsers', link: '/en/guide/examples#block-headless-browsers' },
                  { text: 'Load Polyfills', link: '/en/guide/examples#load-browser-specific-polyfills' },
                  { text: 'WeChat Detection', link: '/en/guide/examples#wechat-environment-detection' },
                  { text: 'SSR / Node.js', link: '/en/guide/examples#ssr--nodejs--parse-request-ua' },
                  { text: 'Windows 10 / 11', link: '/en/guide/examples#accurate-windows-10--11-detection' },
                  { text: 'Vue Composable', link: '/en/guide/examples#vue-composable' },
                  { text: 'React Hook', link: '/en/guide/examples#react-hook' },
                  { text: 'Standalone Detectors', link: '/en/guide/examples#use-standalone-detectors' },
                  { text: 'Analytics Reporting', link: '/en/guide/examples#analytics-reporting' },
                ],
              },
              {
                text: 'Support List',
                link: '/en/guide/support-list',
                collapsed: false,
                items: [
                  { text: 'Browsers', link: '/en/guide/support-list#browsers' },
                  { text: 'Operating Systems', link: '/en/guide/support-list#operating-systems' },
                  { text: 'Rendering Engines', link: '/en/guide/support-list#rendering-engines' },
                  { text: 'Device Types', link: '/en/guide/support-list#device-types' },
                  { text: 'CPU Architecture', link: '/en/guide/support-list#cpu-architecture' },
                  { text: 'Bots / Crawlers', link: '/en/guide/support-list#bots--crawlers' },
                  { text: 'Headless Browsers', link: '/en/guide/support-list#headless--automated-browsers' },
                ],
              },
            ],
          },
          {
            text: 'API Reference',
            items: [
              {
                text: 'Overview',
                link: '/en/api/',
                collapsed: false,
                items: [
                  { text: 'Default Export', link: '/en/api/#default-export' },
                  { text: 'Named Exports', link: '/en/api/#named-exports' },
                ],
              },
              {
                text: 'Type Definitions',
                link: '/en/api/types',
                collapsed: false,
                items: [
                  { text: 'EnvOption', link: '/en/api/types#envoption' },
                  { text: 'BrowserName', link: '/en/api/types#browsername' },
                  { text: 'EngineName', link: '/en/api/types#enginename' },
                  { text: 'OsName', link: '/en/api/types#osname' },
                  { text: 'DeviceName', link: '/en/api/types#devicename' },
                  { text: 'ArchName', link: '/en/api/types#archname' },
                  { text: 'BotName', link: '/en/api/types#botname' },
                  { text: 'NavContext', link: '/en/api/types#navcontext' },
                  { text: 'ParseOptions', link: '/en/api/types#parseoptions' },
                ],
              },
            ],
          },
        ],

        outline: { level: [2, 3], label: 'On this page' },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'uaBrowser',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yangtianxia/ua-browser' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/ua-browser' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 yangtianxia',
    },

    search: {
      provider: 'local',
    },
  },
})
