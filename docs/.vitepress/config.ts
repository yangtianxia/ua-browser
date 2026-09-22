import { defineConfig } from 'vitepress'
import { transformHead } from './seo'

export default defineConfig({
  title: 'uaBrowser',
  description: 'Modern TypeScript-first User-Agent parser for browser and Node.js. Zero dependencies, tree-shakable. Detects browser, OS, device type, engine, CPU architecture, headless browsers, AI bots, and WebView environments.',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://ua-browser.yangtianxia.dev/',
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['script', {}, `var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "https://hm.baidu.com/hm.js?039f7362d3cebddced40c9a853536a89";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})();`],
		['script', {}, `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-55TTJB8M');`],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ua-browser' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  // Canonical URL, hreflang alternates for the EN/zh mirror, and Open Graph tags.
  transformHead,

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/introduction', activeMatch: '/(guide|api)/' },
          { text: 'Playground', link: '/playground' },
          { text: 'Changelog', link: '/changelog' },
          { text: 'Projects', items: [
            { text: 'image-to-base64', link: 'https://yangtianxia.dev/image-to-base64/' },
          ]},
        ],

        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/guide/introduction' },
              { text: 'Browser Usage', link: '/guide/browser' },
              { text: 'Node.js / SSR', link: '/guide/ssr' },
              { text: 'Examples', link: '/guide/examples' },
              { text: 'Support List', link: '/guide/support-list' },
            ],
          },
          {
            text: 'API Reference',
            link: '/api/',
            items: [
              { text: 'Default Export', link: '/api/default' },
              { text: 'Parse Functions', link: '/api/parse' },
              { text: 'Env Context', link: '/api/env' },
              { text: 'Standalone Detectors', link: '/api/detectors' },
              { text: 'Type Definitions', link: '/api/types' },
            ],
          },
        ],
        outline: { level: [2, 3], label: 'On this page' },
      },
    },

    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: 'uaBrowser',
      description: '零依赖 UA 检测库 — 浏览器、OS、设备类型、AI 爬虫识别，支持 Node.js 与 SSR',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/introduction', activeMatch: '/zh/(guide|api)/' },
          { text: 'Playground', link: '/zh/playground' },
          { text: '更新日志', link: '/zh/changelog' },
          { text: '项目', items: [
            { text: 'image-to-base64', link: 'https://yangtianxia.dev/image-to-base64/' },
          ]},
        ],

        sidebar: [
          {
            text: '指南',
            items: [
              { text: '介绍', link: '/zh/guide/introduction' },
              { text: '浏览器端使用', link: '/zh/guide/browser' },
              { text: 'Node.js / SSR', link: '/zh/guide/ssr' },
              { text: '使用示例', link: '/zh/guide/examples' },
              { text: '内置支持列表', link: '/zh/guide/support-list' },
            ],
          },
          {
            text: 'API 参考',
            link: '/zh/api/',
            items: [
              { text: '默认导出', link: '/zh/api/default' },
              { text: '解析函数', link: '/zh/api/parse' },
              { text: '环境上下文', link: '/zh/api/env' },
              { text: '独立检测器', link: '/zh/api/detectors' },
              { text: '类型定义', link: '/zh/api/types' },
            ],
          },
        ],

        outline: { level: [2, 3], label: '本页目录' },
      },
    },
  },

  themeConfig: {
    logo: '/logo.png',
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
