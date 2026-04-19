import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'uaBrowser',
  description: '通过 User Agent 检测浏览器、系统及设备类型，零依赖',
  lang: 'zh-CN',
  base: '/ua-browser/',

  head: [
    ['link', { rel: 'icon', href: '/ua-browser/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'uaBrowser',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      { text: 'Playground', link: '/playground' },
      { text: '更新日志', link: '/changelog' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '使用示例', link: '/guide/examples' },
            { text: '内置支持列表', link: '/guide/support-list' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '总览', link: '/api/' },
            { text: '类型定义', link: '/api/types' },
          ],
        },
      ],
    },

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
