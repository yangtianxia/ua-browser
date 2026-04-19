import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'uaBrowser',
  description: '通过 User Agent 检测浏览器、系统及设备类型，零依赖',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'uaBrowser',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      { text: 'Playground', link: '/playground' },
      {
        text: 'v1.0.0',
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: '从 v0.x 迁移', link: '/guide/migration' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '从 v0.x 迁移', link: '/guide/migration' },
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
