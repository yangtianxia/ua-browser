import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'uaBrowser',
  description: '通过 User Agent 检测浏览器、系统及设备类型，零依赖',
  lang: 'zh-CN',
  base: '/ua-browser/',

  head: [
    ['link', { rel: 'icon', href: '/ua-browser/favicon.ico' }],
    ['script', {}, `var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "https://hm.baidu.com/hm.js?039f7362d3cebddced40c9a853536a89";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})();`],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'uaBrowser',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'Playground', link: '/playground' },
      { text: '更新日志', link: '/changelog' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '使用示例', link: '/guide/examples' },
          { text: '内置支持列表', link: '/guide/support-list' },
        ],
      },
      {
        text: 'API 参考',
        items: [
          { text: '总览', link: '/api/' },
          { text: '类型定义', link: '/api/types' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yangtianxia/ua-browser' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/ua-browser' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 yangtianxia',
    },

    outline: false,

    search: {
      provider: 'local',
    },
  },
})
